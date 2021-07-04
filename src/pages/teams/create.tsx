import SettingsBox from "../../components/SettingsBox";
import { withApollo } from "../../hoc/withApollo";
import { withDashboard } from "../../hoc/withDashboard";


const CreateTeam = () => {
	return (
		<div className={`max-w-5xl mx-auto`}>
			<div className={`md:col-span-9 space-y-6 px-6 md:pt-8`}>
				<SettingsBox />
			</div>
		</div>
	)
};

// export default Projects;
export default withApollo(withDashboard(CreateTeam));
