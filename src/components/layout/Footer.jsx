import { Container, Typography, Box } from "@mui/material";

import Link from "../common/Link";
import Logo from "../common/Logo";

/**
 * Footer component displaying site credits and links.
 *
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = () => {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        background: theme.palette.background.default,
        padding: 0,
      })}
    >
      <Container>
        <Typography component="div" variant="body2" sx={{ marginBottom: "4rem" }}>
          <Box
            component="div"
            sx={[
              {
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                mb: 1,
              },
              (theme) => ({ color: theme.palette.grey[700] }),
            ]}
          >
            <Logo link={true} height={28} color="currentcolor" />
          </Box>

          <Typography component="p" align="center" sx={{ fontSize: "0.75rem", lineHeight: 2 }}>
            Created by <Link href="https://github.com/vijayhardaha">Vijay Hardaha</Link> &bull; Built using{" "}
            <Link href="https://nextjs.org">Next.js</Link>
            <br />
            &copy; {new Date().getFullYear()} <Link href="/">Kabir Ke Dohe</Link>. All rights reserved.
          </Typography>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
