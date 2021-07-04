import { useCallback, useEffect, useState } from "react"
import { debounce } from "lodash";
import { useTeamNameAvailable } from "../generated/page";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { CreateTeamMutationDocument, CreateTeamMutationMutation } from "../generated/graphql";
import { useRouter } from "next/router";



export default function SettingsBox () {

	const [teamName, setTeamName] = useState('');
	const [ready, setReady] = useState(false);
	useEffect(() =>{ 
		console.log('teamnaem', teamName)
		if (teamName.length > 3) {
			setReady(true)
			// debouncedCallback(teamName)
		} else {
			setReady(false)
		}
	}, [teamName])

	const router = useRouter()
	const [createTeam, { error }] = useMutation<CreateTeamMutationMutation>(CreateTeamMutationDocument, {
		onError: () => {},
		onCompleted: (data) => {
			if (data.createTeam?.slug) {
				router.push('/dashboard/' + data.createTeam.slug)
			}
		}
	});

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded">
        <div className="space-y-3 p-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <h3 className="text-xl text-black dark:text-white mb-3">Create a Team</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
								This is your team’s URL namespace on StaffBar. Within it, your team can inspect their projects, check out any recent activity, or configure settings to their liking. 
                <br />
              </p>
              <div className="sm:w-80 flex items-center space-x-2">
								<span
								className={`p-2 text-sm border  border-gray-200`}	
								>
									staffbar.com/
								</span>
                <input
                  name="settings.branding.logo"
                  id="settings.branding.logo"
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  autoCorrect="off"
                  className="m-0 h-9 text-sm rounded w-full border  border-gray-200 py-0 px-3"
									value={teamName}
									onChange={(e) => {
										setTeamName(e.target.value)
									}}
                  placeholder="team-name"
                />
              </div>
							{ error ? 'Unable to create team: ' + error.message : ''}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 py-3 px-4 border-t border-gray-200 dark:border-gray-800 text-black dark:text-white">
          <div className="text-sm text-gray-500">
						Continuing will initiate a 14 day trial of the <a href="/pricing">Pro plan</a>.
          </div>
          <button
            type="submit"
						{...(ready ? {} : { 'disabled': true } )}
            className={`${ready ? 'bg-gray-200 text-white-100' : 'text-gray-400 dark:text-gray-600' } px-3 h-8 text-sm bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 box-border relative inline-flex items-center align-middle min-w-min rounded-md select-none outline-none justify-center text-center whitespace-nowrap transition overflow-hidden appearance-none focus:outline-none`}
						onClick={() => {
							// Call the mutation
							createTeam({
								variables: {
									teamName
								}
							}).catch();
						}}
          >
            Save
          </button>
        </div>
    </div>
  )
}
