import Headers from "./Header";
// import { FC } from 'react';
// import { GetServerSideProps } from "next";
import { PageDashboardComp, ssrDashboard } from "../../generated/page";
import { TeamContextProvider } from "../../hooks/TeamContext";


const DashboardLayout: PageDashboardComp =  ({ 
	children,
}) =>  {

	return (
		<>
		<TeamContextProvider>
			<Headers />
			{children}
		</TeamContextProvider>
		</>
	)
};

export default DashboardLayout;
