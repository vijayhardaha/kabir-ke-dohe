import { Box, Button } from "@mui/material";
import Link from "next/link";

import CoupletsList from "@/src/components/couplets/CoupletsList";
import CoupletsSlider from "@/src/components/couplets/CoupletsSlider";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SectionHeader from "@/src/components/layout/SectionHeader";
import SEO from "@/src/components/seo/SEO";
import { PAGES_SEO_CONFIG } from "@/src/constants/seo";
import { getPermalinkWithBase } from "@/src/utils/seo";

/**
 * Home page component displaying the latest dohe.
 *
 * This component renders a page template with a header, a list of latest couplets,
 * and a button to view all couplets.
 *
 * @returns {JSX.Element} The rendered Home page component.
 */
const Home = () => {
  const queryParams = {
    pagination: false,
    perPage: 10,
    filter: false,
  };

  const { title, description, keywords } = PAGES_SEO_CONFIG.home;

  return (
    <PageTemplate coverChildren={<CoupletsSlider />}>
      <SEO title={title} description={description} keywords={keywords} url={getPermalinkWithBase()} isHomePage={true} />
      <SectionHeader title="Latest Dohe" />
      <SectionBody>
        <CoupletsList query={queryParams} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button variant="contained" color="dark" component={Link} href="/couplets" size="large">
            View All Dohe
          </Button>
        </Box>
      </SectionBody>
    </PageTemplate>
  );
};

export default Home;
