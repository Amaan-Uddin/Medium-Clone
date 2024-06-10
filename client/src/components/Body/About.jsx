const About = ({ about }) => {
	return (
		<div className="container ">
			<div dangerouslySetInnerHTML={{ __html: about }} className="read-content my-5 about-font"></div>
		</div>
	)
}
export default About
