import * as React from 'react';
import { Box, Tab } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Image from 'next/image';

const Home = ({ categoryData }) => {
  const [category, setCategory] = React.useState(categoryData[0]?.slug || '');

  return (
    <>
      <Box className="banner">
        <Box className="maxWidth">
          <h1>Beyond Ordinary ETFs</h1>
          <p>A lineup that spans disruptive tech, equity income, commodities, and more.</p>

          <Box className="text-scroll">
            <h5>Marketcap</h5>
            <h5>Smart Beta</h5>
            <h5>Thematic</h5>
          </Box>

          <Box className="categories">
            <h2>Explore schemes by category</h2>
            <TabContext value={category}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList 
                  onChange={(e, val) => setCategory(val)} 
                  aria-label="schemes by category"
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                >
                  {categoryData?.map((category, index) => {
                    return <Tab key={index} label={category.title} value={category.slug} />
                  })}
                </TabList>
              </Box>
              {categoryData?.map((category, index) => {
                return (
                  <TabPanel value={category.slug} key={index}>
                    <p>{category.description}</p>
                    <Image
                      src={category.image_url}
                      alt={category.title}
                      height={58}
                      width={256}
                    />
                  </TabPanel>
                )
              })}
            </TabContext>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const response = await axios.get('https://cms-dev.mirae.webileapps.io/wp-json/mirae/v1/schemes');
    return {
      props: {
        categoryData: response.data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        categoryData: [],
      },
    };
  }
}

export default Home;
