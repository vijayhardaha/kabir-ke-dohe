import React from "react";

import { Tooltip as MuiTooltip, tooltipClasses } from "@mui/material";
import PropTypes from "prop-types";

/**
 * A custom Tooltip component that adjusts the margin based on the tooltip's placement.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content that the tooltip wraps.
 * @returns {JSX.Element} The rendered Tooltip component with customized margins.
 */
const Tooltip = ({ children, ...props }) => {
	return (
		<MuiTooltip
			arrow
			slots={{
				popper: {
					sx: {
						[`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]: {
							marginTop: "8px",
						},
						[`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]: {
							marginBottom: "8px",
						},
						[`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]: {
							marginLeft: "8px",
						},
						[`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
							marginRight: "8px",
						},
					},
				},
			}}
			{...props}
		>
			{children}
		</MuiTooltip>
	);
};

Tooltip.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Tooltip;
