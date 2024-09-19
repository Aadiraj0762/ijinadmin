import { m, useScroll, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// @mui
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// sections
import {
    HomeAdvertisement,
    HomeCleanInterfaces,
    HomeColorPresets,
    HomeDarkMode,
    HomeForDesigner,
    HomeHero,
    HomeHugePackElements,
    HomeLookingFor,
    HomeMinimall,
    HomePricingPlans,
} from '../sections/home';

// ----------------------------------------------------------------------

export default function HomePage() {
  const theme = useTheme();

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progress = (
    <m.div
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1999,
        position: 'fixed',
        transformOrigin: '0%',
        backgroundColor: theme.palette.primary.main,
        scaleX,
      }}
    />
  );

  return (
    <>
      <Helmet>
        <title> The starting point for your next project | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      {progress}

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimall />

        <HomeHugePackElements />

        <HomeForDesigner />

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricingPlans />

        <HomeLookingFor />

        <HomeAdvertisement />
      </Box>
    </>
  );
}
