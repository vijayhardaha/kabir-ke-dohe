import React, { useState, useCallback } from "react";

import { Button, TextField, Typography, Alert, Stack, Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

/**
 * CoupletFeedbackForm component for handling user feedback submission.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string|number} props.coupletId - The ID of the couplet being commented on.
 * @param {string} props.couplet - The Hindi text of the couplet.
 * @returns {JSX.Element} The rendered CoupletFeedbackForm component.
 */
const CoupletFeedbackForm = ({ coupletId, couplet }) => {
	const [formData, setFormData] = useState({
		name: "Anonymous",
		message: "",
		honey: "",
	});

	const [errors, setErrors] = useState({});
	const [alert, setAlert] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleChange = useCallback((event) => {
		setFormData((prevData) => ({
			...prevData,
			[event.target.name]: event.target.value,
		}));
	}, []);

	const handleFocus = useCallback((event) => {
		setErrors((prevErrors) => ({
			...prevErrors,
			[event.target.name]: "",
		}));
	}, []);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();

			if (formData.honey !== "") {
				console.log("Spam detected! Form submission ignored.");
				return;
			}

			const validateForm = () => {
				const newErrors = {};
				if (!formData.name.trim()) newErrors.name = "Name is required.";
				if (!formData.message.trim()) newErrors.message = "Message is required.";
				setErrors(newErrors);
				return Object.keys(newErrors).length === 0;
			};

			if (!validateForm()) return;

			setLoading(true);

			try {
				const response = await fetch("/api/feedback", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ ...formData, coupletId, couplet }),
				});

				if (response.ok) {
					setAlert({ severity: "success", message: "Feedback submitted successfully!" });
					setFormData({ name: "", message: "", honey: "" });
					setErrors({});
				} else {
					setAlert({ severity: "error", message: "Feedback submission failed!" });
				}
			} catch {
				setAlert({ severity: "error", message: "An error occurred during submission." });
			} finally {
				setLoading(false);
			}
		},
		[formData, coupletId, couplet]
	);

	return (
		<Stack spacing={2}>
			{alert && (
				<Box>
					<Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 1 }}>
						{alert.message}
					</Alert>
				</Box>
			)}
			<Box component="form" onSubmit={handleSubmit}>
				<Typography variant="body1" paragraph>
					Your feedback helps us improve our content. You can submit corrections for typos, proofreading, meaning
					adjustments, and reference links. Feel free to provide any suggestions that could enhance the clarity and
					accuracy of the couplet.
				</Typography>

				<Box
					sx={{
						mt: 2,
					}}
				>
					<TextField
						label="Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						onFocus={handleFocus}
						size="large"
						fullWidth
						error={Boolean(errors.name)}
						helperText={errors.name}
						disabled={loading}
					/>
				</Box>

				<Box
					sx={{
						mt: 2,
					}}
				>
					<TextField
						label="Message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						onFocus={handleFocus}
						rows={6}
						size="large"
						multiline
						fullWidth
						error={Boolean(errors.message)}
						helperText={errors.message}
						placeholder="Write your feedback here"
						disabled={loading}
						inputProps={{ maxLength: 1000 }}
					/>
					<Typography
						variant="caption"
						sx={{
							color: "textSecondary",
							mt: 1,
						}}
					>
						{formData.message.length} / 1000 characters
					</Typography>
				</Box>

				<Box
					sx={{
						mt: 2,
					}}
				>
					<input type="text" name="honey" value={formData.honey} onChange={handleChange} style={{ display: "none" }} />
					<Button
						type="submit"
						variant="contained"
						color="primary"
						size="large"
						disabled={loading}
						startIcon={loading && <CircularProgress size={24} sx={{ color: "rgba(0, 0, 0, 0.12)" }} />}
					>
						{loading ? "Submitting..." : "Submit Feedback"}
					</Button>
				</Box>
			</Box>
		</Stack>
	);
};

CoupletFeedbackForm.propTypes = {
	coupletId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	couplet: PropTypes.string.isRequired,
};

export default CoupletFeedbackForm;
