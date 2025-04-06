import { useEffect, useState } from "react";

import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";

const SearchForm = () => {
  const router = useRouter();
  const { q: query } = router.query;

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (router.isReady) {
      setSearchQuery(query || "");
    }
  }, [router.isReady, query]);

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={searchQuery}
          placeholder="Type here to search &hellip;"
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          sx={{ "& .MuiOutlinedInput-notchedOutline": { borderRight: "0 !important", borderWidth: "1px !important" } }}
        />
      </Box>
      <Button variant="contained" color="primary" size="large" onClick={handleSearch} sx={{ minHeight: 40 }}>
        Search
      </Button>
    </Box>
  );
};

export default SearchForm;
