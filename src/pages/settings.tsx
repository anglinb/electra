import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { withApollo } from '../hoc/withApollo'
import { withDashboard } from '../hoc/withDashboard'
import { TeamContext, TeamContextStateTypeSucceeded, TeamContextState } from '../hooks/TeamContext';

import {  DeleteTeamMutationDocument, DeleteTeamMutationMutation, DeleteTeamMutationMutationFn, TeamFieldsFragment, Team_Type } from '../generated/graphql';
import { supportLink } from '../config';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
const subMenus = [
	{
		name: 'General',
		path: '/settings'
	}
];



function SettingsMenu({ 
	team	
	}: { team: TeamFieldsFragment }) {

	const [teamSlug, setTeamSlug] = useState('')
	const [disabled, setDisabled] = useState(true);
	useEffect(() => {
		let shouldBeDisabled = teamSlug !== team.slug 
		console.log(teamSlug, shouldBeDisabled, team.slug)
		if (shouldBeDisabled !== disabled ) {
			setDisabled(shouldBeDisabled)
		}
	}, [teamSlug, disabled, team.slug])

	const router = useRouter()
	const [deleteTeam, { error }] = useMutation<DeleteTeamMutationMutation>(DeleteTeamMutationDocument, {
		onError: () => {},
		onCompleted: (data) => {
			if (data) {
				router.push('/')
			}
		}
	})


  return (
    <main>
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 pb-px dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-6 pb-16 space-y-3">
            <div className="text-4xl text-black dark:text-white">
							Settings
            </div>
            <div className="text-sm text-gray-500 truncate">
              Update your team settings here 
            </div>
          </div>
        </div>
        <main className="max-w-5xl mx-auto md:px-6 relative">
          <div className="md:grid md:grid-cols-12 md:gap-x-5">
            <aside className="px-6 md:px-1 md:col-span-3">
              <nav className="space-y-5 py-6 md:py-0 md:sticky md:top-0 md:pt-8 text-gray-500">
								{ subMenus.map((m) => {
									return (
										<Link
										key={m.path}
										href={m.path}
										>
										<a
											className="block text-sm transition focus:outline-none whitespace-nowrap text-black dark:text-white text-black dark:text-white"
										>
											{m.name}
										</a>
										</Link>
									)	
								})
							}
              </nav>
            </aside>
            <div className="md:col-span-9 space-y-6 px-6 md:pt-8">
              <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
                  <div className="space-y-3 p-4">
                    <h3 className="text-xl text-black dark:text-white">
											Delete Team
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
											{ team.teamType === Team_Type.Personal ? 'You cannot delete your personal team' :  'This cannot be undone!'}
											{ error ? error.message : ''}
                    </p>
                    <div className="lg:w-2/5">
											{
												team.teamType === Team_Type.Business  ? 
												<input
													name="name"
													id="name"
													type="text"
													autoComplete="off"
													spellCheck="false"
													autoCorrect="off"
													className={` h-9 text-sm rounded w-full !ring-blue-200 !border-gray-200 dark:!border-gray-800 focus:!ring dark:focus:!ring-0 focus:!border-blue-300 dark:focus:!border-gray-600 transition focus-within:z-10 !focus:outline-none bg-white dark:bg-gray-900 placeholder-gray-300 dark:placeholder-gray-700 text-gray-800 dark:text-gray-200 py-0 px-3`}
													placeholder={`Type ${team.slug}`}
													value={teamSlug}
													onChange={(e) => {
														setTeamSlug(e.target.value)
													}}
												/> : undefined }
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 py-3 px-4 border-t border-gray-200 dark:border-gray-800 text-black dark:text-white">
                    <div className="text-sm text-gray-500">
										{ team.teamType === Team_Type.Personal ? 
										<>StaffBar not working for you? <Link href={supportLink}><a target={'_blank'} rel={`noopener`} >Let us know!</a></Link></> :  
										<>Please type <code className={`bg-gray-200  dark:bg-gray-800 py-1 px-1 rounded-md`}>{team.slug}</code> to confirm.	</>
										}
                    </div>
                    <button
                      type="submit"
											{...(!disabled ? {} : { 'disabled': true } )}
                      className={`${!disabled ? 'bg-red-200 text-white-100' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed' }  px-3 h-8 text-sm text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 box-border relative inline-flex items-center align-middle min-w-min rounded-md select-none outline-none justify-center text-center whitespace-nowrap transition overflow-hidden appearance-none focus:outline-none`}
											onClick={() => {
												deleteTeam({ 
													variables: {
														teamId: team.id
													}
												})
											}}
                    >
                      Delete
                    </button>
                  </div>
              	</div>
            </div>
            </div>
        </main>
      </div>
    </main>
  )
}

const Settings = () => {
	const { teamContext } = useContext(TeamContext);

	if (teamContext.state === TeamContextState.Succeeded) {
		return (
			<SettingsMenu
				team={teamContext.selectedTeam}
			/>
		)
	}
	return null;
}

export default withApollo(withDashboard(Settings))
