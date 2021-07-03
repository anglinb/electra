import { faviconConfigs } from "../config";
const Favicon = () => {
	return (
		<>
			{faviconConfigs.map((fav) => {

			return (
				<link 
					key={fav.rel+fav.size} 
					rel={fav.rel}
					href={`icons/favicon-${fav.size}.png`}
					sizes={`${fav.size}x${fav.size}`}
				/>
			)
		})}
		</>
	)
};

export default Favicon;
