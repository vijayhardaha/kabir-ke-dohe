import { Box, Button, Typography } from "@mui/material";
import { GoArrowUpLeft } from "react-icons/go";

import SearchForm from "@/src/components/common/SearchForm";
import PageHeader from "@/src/components/layout/PageHeader";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";

/**
 * Custom 404 page component.
 *
 * This component renders a user-friendly 404 error page indicating that the requested page could not be found.
 * It provides a button to navigate back to the homepage and a search box to help users find other content.
 *
 * @returns {JSX.Element} The rendered 404 page component.
 */
const Custom404 = () => {
  return (
    <PageTemplate>
      <SectionBody>
        <Box component="article" sx={{ textAlign: "center", mt: 4 }}>
          <PageHeader title="Oops! Page Not Found" />
          <Typography component="p">
            It looks like the page you’re trying to reach doesn’t exist anymore or may have been moved. We apologize for
            the inconvenience. You can go back to our homepage or use the search function to find what you’re looking
            for.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <SearchForm />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" href="/" startIcon={<GoArrowUpLeft />}>
              Back to Home
            </Button>
          </Box>
        </Box>
      </SectionBody>
    </PageTemplate>
  );
};

export default Custom404;
