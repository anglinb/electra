import { FC, createContext, useEffect, useReducer } from 'react';
import { useDashboard } from '../generated/page';
import { DashboardQuery, TeamFieldsFragment, Team_Type } from '../generated/graphql';
import { productName } from '../config';
import { toSlug } from '../utils';
import { useRouter } from 'next/router';

// These are the values in the dabase, they 
// can't change

const getLocalSelectedTeamId = () => {
	try {
		return localStorage.getItem(`${toSlug(productName)}_selectedTeamId`)  || undefined
	} catch {
	}
	return undefined;
}

export enum TeamContextState {
	Loading = 'loading',
	Failed = 'failed',
	Succeeded = 'succeeded',
}

export type TeamContextStateTypeSucceeded = {
	state: TeamContextState.Succeeded,
	teams: TeamFieldsFragment[],
	selectedTeam: TeamFieldsFragment,
	selectedTeamId: string,
};

export type TeamContextStateTypeLoading = {
	state: TeamContextState.Loading,
	selectedTeamId: string | undefined,
}

export type TeamContextStateTypeFailed = {
	state: TeamContextState.Failed,
	selectedTeamId: string | undefined,
	errorMessage: string
}

export type TeamContextStateType = 
	| TeamContextStateTypeFailed
	| TeamContextStateTypeLoading
	| TeamContextStateTypeSucceeded

type TeamContextStoreType = {
	teamContext: TeamContextStateType;
};

export type TeamContextType = {
	teamContext: TeamContextStateType;
	selectTeam: (teamId: string) => void;
};

const defaultTeamContext: TeamContextStateType = {
	state: TeamContextState.Loading,
	selectedTeamId: undefined,
};

export const TeamContext = createContext<TeamContextType>(
	{ 
		teamContext: defaultTeamContext,
		selectTeam: (teamId: string) => {},
	}
);
;

enum ActionKind {
	LoadingComplete = 'LoadingComplete',
	SelectTeam = 'select_team'
}

type LoadingCompleteSuccessAction = {
	type: ActionKind.LoadingComplete,
	data: DashboardQuery,
	error: undefined
};

type LoadingCompleteFailureAction = {
	type: ActionKind.LoadingComplete,
	error: Error
	data: undefined,
};

type LoadingCompleteAction = 
	| LoadingCompleteSuccessAction
	| LoadingCompleteFailureAction

type SelectTeamAction ={
	type: ActionKind.SelectTeam,
	teamId: string
}


type Action =  
 | LoadingCompleteAction
 | SelectTeamAction

const reducer  = (state: TeamContextStoreType, action: Action): TeamContextStoreType => {

	switch(action.type) {
		case ActionKind.LoadingComplete: {
			if(action.error || (action.data.viewer?.teams || []).length < 1) {
				return {
					...state,
					teamContext: {
						...state.teamContext,
						state: TeamContextState.Failed,
						errorMessage: action.error?.message || 'Unable to load teams'
					}
				}
			}

			const teams = action.data.viewer?.teams!
			const backupTeam = teams.find(t => t.teamType === Team_Type.Personal) || teams[0]
			const requestedSelectedTeam = state.teamContext.selectedTeamId ? teams.find(t => t.id === state.teamContext.selectedTeamId) : undefined
			const selectedTeam = !!requestedSelectedTeam ? requestedSelectedTeam :  backupTeam

			return {
				...state,
				teamContext: {
					...state.teamContext,
					state: TeamContextState.Succeeded,
					teams,
					selectedTeam: selectedTeam!,
					selectedTeamId: selectedTeam!.id
				}
			}
		};
		case ActionKind.SelectTeam: {
			const { teamId } = action;
			if (state.teamContext.state === TeamContextState.Succeeded) {
				let team = state.teamContext.teams.find(t => t.id  === teamId)
				if (team) {
					return {
						...state,
						teamContext: {
							...state.teamContext,
							selectedTeam: team,
							selectedTeamId: teamId
						}
					}
				}
				// If we can't find the team don't change it
				return state;
			}

			return {
				...state,
				teamContext: {
					...state.teamContext,
					selectedTeamId: teamId
				}
			}
		};
	};
}


export const TeamContextProvider:FC = ({ children }) => {
	const { data, error } = useDashboard();
	const [store, dispatch] = useReducer(reducer, {
		teamContext: {
			state: TeamContextState.Loading,
			selectedTeamId: getLocalSelectedTeamId()
		}
	});


	// This makes the selected team mirror the router...
	const router = useRouter();
	useEffect(() => {
		const { teamSlug } = router.query;
		if (store.teamContext.state === TeamContextState.Succeeded && teamSlug) {
			// Try to find the team slug
			let team = store.teamContext.teams.find(t => t.slug === teamSlug)
			if (team && store.teamContext.selectedTeamId !== team.id) {
				dispatch({
					type: ActionKind.SelectTeam,
					teamId: team.id
				})
			}
		}
	}, [router, store.teamContext])


	useEffect(() => {
		if (data) {
			dispatch({
				type: ActionKind.LoadingComplete,
				data,
				error: undefined
			})
			return
		}

		if (error) {
			dispatch({
				type: ActionKind.LoadingComplete,
				error,
				data: undefined
			})
			return
		}
	}, [data, error])

	useEffect(() => {
		if (store.teamContext.selectedTeamId) {
			try {
				localStorage.setItem(`${toSlug(productName)}_selectedTeamId`, store.teamContext.selectedTeamId)
			} catch {}
		}
	}, [store.teamContext])

	return (
    <TeamContext.Provider
      value={{
				...store,
				selectTeam: (teamId: string) => {

					if (store.teamContext.state === TeamContextState.Succeeded) {
						let team = store.teamContext.teams.find(t => t.id === teamId) 
						if (team) {
							router.push('/dashboard/' + team.slug)
						}
					}
				}
			}}
			>
				{children}
		</TeamContext.Provider>
	)
}

export default TeamContextProvider;
