import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { IoAddCircleOutline, IoCodeOutline, IoPeople } from "react-icons/io5";
import { TeamContextState, TeamContextType } from "../../hooks/TeamContext";
// import { TeamContext, TeamContextState } from "../../hooks/TeamContext";

const TeamDropdown = ({ teamContext }: { teamContext: TeamContextType }) => {

  const { selectTeam } = teamContext;
  const router = useRouter();

  return (
    <Menu as="div" className="relative inline-block text-left">
    <Menu.Button 

      disabled={teamContext.teamContext.state !== TeamContextState.Succeeded}
      className="inline-flex ml-2 px-0.5 py-1 justify-center w-full text-sm text-gray-300 border rounded-md  focus:outline-none bg-gray-100  hover:bg-gray-200 dark:border-gray-700 group-hover:border-gray-200 dark:bg-gray-800  dark:hover:bg-gray-900 dark:group-hover:border-gray-800">
      <IoCodeOutline
        style={{
          transform: 'rotate(90deg)'
        }} 
      />
    </Menu.Button>
     <Transition
        as={Fragment}
        enter="transition ease-out duration-50"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-25"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
      <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left dark:bg-gray-900 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="px-1 py-1 ">
          <div className="py-3" role="none">
          <div className="px-2 text-gray-700 dark:text-gray-300 font-semibold text-md whitespace-nowrap">
            Teams
           </div>
           <div className="px-2 text-gray-600 dark:text-gray-400 text-sm">
           </div>
         </div>
      { teamContext.teamContext.state === TeamContextState.Succeeded ?  teamContext.teamContext.teams.map((team) => {
        return (
            <Menu.Item
            key={team.slug} 
            >
            {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-500 text-white' : 'text-gray-900'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() => {
                        selectTeam(team.id)
                      }}
                    >
                  <IoPeople 
									     className="w-5 h-5 mr-2 text-violet-400"
											 aria-hidden="true"	
										/>
                    { team.name }
                    </button>
                  )}
            </Menu.Item>
          )
        })
        : undefined
      }
        </div>
        <Menu.Item>
        {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-500 text-white' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={() => {
                    router.push('/teams/create')
                  }}
                >
                  <IoAddCircleOutline
                    className="w-5 h-5 mr-2 text-violet-400"
                    aria-hidden="true"	
                  />
                { `Create a Team` }
                </button>
              )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>

		// <button
		// 	className="transition px-1.5 py-1 rounded text-sm text-gray-300 border border-transparent focus:outline-none bg-gray-100  hover:bg-gray-200 group-hover:border-gray-200 dark:hover:bg-gray-900 dark:group-hover:border-gray-800"
		// 	id="headlessui-menu-button-2"
		// 	type="button"
		// 	aria-haspopup="true"
		// >
		// 	<IoCodeOutline
		// 		style={{
		// 			transform: 'rotate(90deg)'
		// 		}} 
		// 	/>
		// 	 <TeamDropdown />
		// </button>

    // <div>
    //   <div
    //     className="origin-top-right absolute right-0 mt-2 w-48 min-w-max rounded-md shadow-xl bg-white outline-none ring-1 ring-gray-200 divide-y divide-gray-200 dark:bg-gray-900 dark:ring-gray-800 dark:divide-gray-800 z-50"
    //     aria-labelledby="headlessui-menu-button-1"
    //     id="headlessui-menu-items-14"
    //     role="menu"
    //     tabIndex={0}
    //   >
    //     <div className="py-3" role="none">
    //       <div className="px-4 text-gray-700 dark:text-gray-300 font-semibold text-md whitespace-nowrap"></div>
    //       <div className="px-4 text-gray-600 dark:text-gray-400 text-sm"></div>
    //     </div>
    //     {/* TODO: Justin make this look like vercel */}
    //     { 
    //       // teamContext.state === TeamContextState.Succeeded ? 

    //         // teamContext.availableTeams.map(x => x.name).join(', ') : undefined
        
    //     }
    //     <div className="py-3" role="none">
    //       <div className="px-4 text-gray-700 dark:text-gray-300 font-semibold text-md whitespace-nowrap">
    //         Create Team
    //       </div>
    //       <div className="px-4 text-gray-600 dark:text-gray-400 text-sm">
		// 				Coming soon...
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
export default TeamDropdown;
