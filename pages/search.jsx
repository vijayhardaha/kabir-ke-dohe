import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

import SearchForm from "@/src/components/common/SearchForm";
import CoupletsList from "@/src/components/couplets/CoupletsList";
import PageTemplate from "@/src/components/layout/PageTemplate";
import SectionBody from "@/src/components/layout/SectionBody";
import SectionHeader from "@/src/components/layout/SectionHeader";
import SEO from "@/src/components/seo/SEO";
import { getPermalinkWithBase } from "@/src/utils/seo";

/**
 * Search Page component that displays search results using CoupletsList.
 *
 * @returns {JSX.Element} The rendered SearchPage component.
 */
const SearchPage = () => {
  const router = useRouter();
  const { q: query } = router.query;

  // Dynamic SEO configuration
  const seoTitle = query ? `Search results for: ${query}` : "Search";
  const seoDescription = query ? `Results for your search query: ${query}` : "Search our site for relevant content.";
  const seoKeywords = query ? [query] : ["search", "results", "content"];

  return (
    <PageTemplate>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords.join(", ")}
        url={getPermalinkWithBase()}
      />

      <SectionHeader title={query ? `Search results for: ${query}` : "Search"} />

      <SectionBody>
        <Box sx={{ mb: 6 }}>
          {!query && (
            <Typography component="p" sx={{ mb: 2 }}>
              Welcome to our search page! Use the search form below to find couplets by entering keywords, tags. Press
              Enter or click Search to view the results.
            </Typography>
          )}

          <SearchForm />
        </Box>

        {query && (
          <CoupletsList
            query={{
              s: query,
            }}
          />
        )}
      </SectionBody>
    </PageTemplate>
  );
};

export default SearchPage;
