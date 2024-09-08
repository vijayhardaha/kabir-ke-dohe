import React from "react";

import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

import Link from "../../common/Link";
import getIcon from "@/src/utils/icon";
import { getTagLink } from "@/src/utils/seo";

/**
 * Renders metadata information for a couplet.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.couplet - The couplet data.
 * @param {Array<Object>} props.couplet.tags - List of tags associated with the couplet.
 * @param {string} props.couplet.tags[].name - The name of the tag.
 * @param {string} props.couplet.tags[].slug - The slug of the tag.
 * @param {Object} props.sx - Additional styles to merge with the default styles.
 * @returns {JSX.Element} The rendered CoupletMeta component.
 */
const CoupletMeta = ({ couplet, sx = {} }) => {
	const { tags } = couplet;

	return (
		<Box
			sx={{
				display: "flex",
				gap: 1,
				mb: 1.5,
				flexDirection: {
					xs: "column",
					sm: "row",
				},
				"& > div:not(:last-of-type)::after": {
					content: { sm: '"/"' },
					ml: { sm: 1 },
				},
				...sx,
			}}
		>
			<Typography component="div" variant="body2">
				<Link href="https://en.wikipedia.org/wiki/Kabir" color="inherit">
					By Sant Kabir Das
				</Link>
			</Typography>
			{tags && tags.length > 0 && (
				<Typography component="div" variant="body2">
					<span style={{ marginRight: "4px", position: "relative", top: "3px" }}>
						{getIcon({ icon: "hash", size: "1rem" })}
					</span>
					{tags.map((tag, index) => (
						<React.Fragment key={tag.slug}>
							<Link href={getTagLink(tag.slug)} color="inherit">
								{tag.name}
							</Link>
							{index < tags.length - 1 && ", "}
						</React.Fragment>
					))}
				</Typography>
			)}
		</Box>
	);
};

CoupletMeta.propTypes = {
	couplet: PropTypes.shape({
		tags: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				slug: PropTypes.string.isRequired,
			})
		),
	}).isRequired,
	sx: PropTypes.object, // Prop type for additional styles
};

export default CoupletMeta;
