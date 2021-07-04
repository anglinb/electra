// import { useSession } from "next-auth/client";
import Link from "next/link";
import { useContext } from "react";
import { docsLink, productName, supportLink } from "../../config";

// import { TeamContext, TeamContextState, TeamType } from "../hooks/TeamContext";
import HeaderProfile from "./HeaderProfile";
import favicon from '../../../public/icons/favicon-32.png';
import faviconDark from '../../../public/icons/favicon-32-dark.png';
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { TeamContext, TeamContextState, TeamContextType, TeamContextStateTypeSucceeded } from "../../hooks/TeamContext";
import { useSession } from "next-auth/client";
import TeamDropdown from "./TeamDropdown";
import { Team_Type } from "../../generated/schema";
import { useRouter } from "next/router";


const TeamHeaderName = ({ teamContextSucceeded }: { teamContextSucceeded: TeamContextStateTypeSucceeded }) => {
	return (
		<div className={`relative flex flex-row items-center`}>
		{teamContextSucceeded.selectedTeam.name}  
		{ teamContextSucceeded.selectedTeam.teamType === Team_Type.Personal ?  <span className=" ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-gray-700 rounded">{`Personal`}</span>  : undefined }
		</div>
	)
};

const TeamHeader = ({ teamContext }: { teamContext: TeamContextType }) => {
	let teamName: React.ReactNode | undefined = undefined;
	switch(teamContext.teamContext.state) {
		case TeamContextState.Loading: {
			teamName = 	<Skeleton width={120} /> ;
			break;
		}
		case TeamContextState.Failed: {
			teamName =	<Skeleton count={0}  width={120} />;
			break;
		}
		case TeamContextState.Succeeded: {
			teamName = <TeamHeaderName teamContextSucceeded={teamContext.teamContext} />
			break;
		}
	};
	return (
		<div className={`relative flex flex-row items-center`}>
			<span 
			className={`text-gray-900 dark:text-gray-100`}
				style={{
					minWidth: '120px'
				}}
			>{teamName}</span>
			<TeamDropdown 
				teamContext={teamContext}	
			/>
		</div>
)

};

const topRightLinks = [
	{
		name: 'Support',
		href: supportLink,
	},
	{
		name: 'Docs',
		href: docsLink,
	},
];


const Headers = () => {
  const [session] = useSession()

  const  teamContext = useContext(TeamContext);
	const router = useRouter();
	console.log('routerpathname', router.pathname)

  return (
    <>
    <header className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 bg-opacity-70 backdrop-filter backdrop-blur-md">
      <div className="max-w-5xl mx-auto">
        <div className="relative h-16 flex justify-between px-6">
          <div className="relative flex lg:px-0">
            <div className="flex-shrink-0 flex items-center space-x-1">

              {/* @next/next/no-html-link-for-pages */}
              <Link
                href="/"
              >
              <a className="flex" >
							<>
								<Image   height={24} width={24} src={favicon}  />
								<span className={' text-gray-900 dark:text-gray-100 pl-2' }>{productName}</span>
							</>
              </a>
              </Link>
              <svg
                className="text-gray-200 dark:text-gray-800"
                viewBox="0 0 24 24"
                width={36}
                height={36}
                stroke="currentColor"
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M16.88 3.549L7.12 20.451" />
              </svg>
              <div className="group relative">
                <div className="flex items-center space-x-2">
                  <span
                    className="flex-1 flex items-center space-x-3"
                  >
										<TeamHeader teamContext={teamContext} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center space-x-5">
						{ 
							topRightLinks.map(link => {
								return (
									<Link
										key={link.href}
										href={link.href}
									>
									<a
										className="hidden sm:inline-flex text-sm transition focus:outline-none whitespace-nowrap dark:text-gray-200 text-gray-500 hover:text-black dark:hover:text-white focus:text-black dark:focus:text-white"
										target="_blank"
										rel="noreferrer"
									>
										{link.name}
									</a>
									</Link>
								)
							})
						}
						<HeaderProfile 
							headerProfileImageUrl={session?.user?.image}
						 />	 
          </div>
        </div>
        <nav className="flex -mb-px space-x-5 pt-1 text-gray-900 overflow-x-auto px-6 scrollbar-none">
          <Link
            href="/"
          >
          <a
            className={`${router.pathname === '/' || router.pathname.startsWith('/dashboard/') ? 'border-black dark:border-white' : ''} text-sm pb-3 px-1 transition focus:outline-none whitespace-nowrap  dark:text-white border-b-2  `}
          >
            Projects
          </a>
          </Link>
					<Link
            href="/settings"
          >
          <a
            className={`${router.pathname.includes('settings') || router.pathname.includes('teams/create') ? 'border-black  dark:border-white' : ''} text-sm pb-3 px-1 transition focus:outline-none whitespace-nowrap dark:text-white border-b-2  dark:border-white`}
          >
            Settings
          </a>
          </Link>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Headers;
