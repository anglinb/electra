import { NextPage } from "next";
import DashboardLayout from "../components/dashboard/DashboardIndex";


export const withDashboard = (Comp: NextPage) => (props: any) => {
  return (
		<DashboardLayout>
      <Comp {...props} />
		</DashboardLayout>
  );
};
