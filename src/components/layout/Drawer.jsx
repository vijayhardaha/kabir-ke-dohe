import React, { useState } from "react";

import { Box, IconButton, Typography, Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import PropTypes from "prop-types";

import Link from "../common/Link";
import Logo from "../common/Logo";
import { NAV_ITEMS } from "@/src/constants/nav";
import { SOCIAL_LINKS } from "@/src/constants/social";
import getIcon from "@/src/utils/icon";

/**
 * Navigation Item component for rendering menu items and sub-items.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Navigation item data.
 * @param {Function} props.handleToggle - Function to handle submenu toggle.
 * @param {Object} props.expanded - State of expanded submenus.
 * @param {boolean} props.isSubItem - Indicates if the item is a submenu item.
 * @returns {JSX.Element} The rendered Navigation Item component.
 */
const NavItem = ({ item, handleToggle, expanded, isSubItem = false }) => (
  <>
    <ListItemButton
      onClick={() => item.submenu && handleToggle(item.title)}
      sx={{ pl: isSubItem ? 2 : 0, pr: 0, borderBottom: "1px solid rgba(0,0,0,.1)", "&:hover": { background: "none" } }}
    >
      <Link href={item.href} sx={{ color: "inherit !important", textDecoration: "none", flexGrow: 1 }}>
        <ListItemText primary={item.title} sx={{ color: "inherit !important", textDecoration: "none", flexGrow: 1 }} />
      </Link>
      {item.submenu && (
        <IconButton sx={{ py: 0, "&:hover": { background: "none" } }}>
          {expanded[item.title] ? getIcon({ icon: "chevronUp" }) : getIcon({ icon: "chevronDown" })}
        </IconButton>
      )}
    </ListItemButton>
    {item.submenu && (
      <Collapse in={expanded[item.title]}>
        <List component="div" disablePadding>
          {item.submenu.map((subitem) => (
            <NavItem key={subitem.title} item={subitem} handleToggle={handleToggle} expanded={expanded} isSubItem />
          ))}
        </List>
      </Collapse>
    )}
  </>
);

NavItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    submenu: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  handleToggle: PropTypes.func.isRequired,
  expanded: PropTypes.objectOf(PropTypes.bool).isRequired,
  isSubItem: PropTypes.bool,
  onClose: PropTypes.func,
};

/**
 * Drawer component that displays the navigation drawer and additional content.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Drawer open state.
 * @param {Function} props.onClose - Function to handle drawer close action.
 * @returns {JSX.Element} The rendered Drawer component.
 */
const Drawer = ({ open, onClose }) => {
  const [expanded, setExpanded] = useState({});

  const handleToggle = (title) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <>
      <Box
        className={classNames({ "is--open": open })}
        sx={{
          width: 400,
          maxWidth: "100%",
          height: "100%",
          position: "fixed",
          padding: 0,
          paddingTop: { xs: "70px", md: "110px" },
          top: 0,
          right: 0,
          display: "block",
          overflow: "auto",
          zIndex: 999,
          transition: "transform .2s ease, visibility 1ms linear .2s",
          backgroundColor: "#ffffff",
          transform: "translate3D(437px, 0, 0)",
          boxShadow: "none",
          "&.is--open": {
            transform: "translate3D(0, 0, 0)",
            boxShadow: "0 0 100px rgba(0, 0, 0, .5)",
          },
        }}
      >
        <Box
          component="div"
          sx={(theme) => ({
            position: "fixed",
            width: "100%",
            left: 0,
            top: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: { xs: 70, md: 110 },
            px: 4,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          })}
        >
          <Logo link height={28} color="#ffffff" />

          <IconButton
            onClick={onClose}
            sx={(theme) => ({
              color: theme.palette.common.white,
              borderRadius: 0,
              "&:hover": {
                background: "rgba(0, 0, 0, 0.15)",
              },
            })}
          >
            {getIcon({ icon: "close" })}
          </IconButton>
        </Box>
        <Box sx={{ px: 4, pt: 5 }}>
          <Box
            sx={{
              mb: 4,
              display: { md: "none" },
            }}
          >
            <List>
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.title} item={item} handleToggle={handleToggle} expanded={expanded} />
              ))}
            </List>
          </Box>
          <Box
            sx={{
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, textTransform: "uppercase", fontWeight: 300, letterSpacing: 1.5 }}>
              Vijay Hardaha
            </Typography>
            <Image
              alt="Vijay Hardaha"
              src="/avatar.jpg"
              height={90}
              width={90}
              priority
              style={{
                borderRadius: "50%",
                margin: "5px 15px 0 0",
                float: "left",
              }}
            />
            <Typography variant="body2" component="p">
              I am a web developer with expertise in WordPress and WooCommerce, and I also work on React and Next.js
              projects. I’m always excited about new challenges and strive to integrate the teachings of Sant Kabir Das
              into my life and work.
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 4,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, textTransform: "uppercase", fontWeight: 300, letterSpacing: 1.5 }}>
              Get in Touch
            </Typography>
            <Typography variant="body2" component="p">
              Feel free to reach out for collaboration or inquiries. I’m passionate about creating innovative web
              solutions and would love to discuss how we can work together.
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                mt: 3,
              }}
            >
              {SOCIAL_LINKS.map(({ href, icon, backgroundColor, ariaLabel }) => (
                <IconButton
                  key={ariaLabel}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor,
                    color: "#ffffff",
                    border: `1px solid transparent`,
                    borderRadius: 0,
                    p: 1,
                    transition: "all 0.3s",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: backgroundColor,
                      borderColor: backgroundColor,
                    },
                  }}
                  aria-label={ariaLabel}
                >
                  {getIcon({ icon, size: "18px" })}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className={classNames({ "is--open": open })}
        sx={{
          width: "100%",
          height: "calc(100% + 60px)",
          position: "fixed",
          top: 0,
          left: 0,
          background: "rgba(0, 0, 0, 0.6)",
          cursor: "pointer",
          transition: "opacity .25s ease-in-out",
          zIndex: 998,
          opacity: 0,
          visibility: "hidden",
          "&.is--open": {
            opacity: 1,
            visibility: "visible",
          },
        }}
        onClick={onClose}
      />
    </>
  );
};

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Drawer;
