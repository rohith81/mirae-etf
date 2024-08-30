import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'jquery.flipster/dist/jquery.flipster.min.css';

import * as React from 'react';

import { Box, Button, Tab, Typography } from "@mui/material";

import $ from 'jquery';
import Image from 'next/image';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import dynamic from 'next/dynamic';
import fetchAPIOnPageLoad from '@/utils/fetchApi';
import { useEffect, useState, useRef } from 'react';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

const Home = ({ categoryData, videosData, faqsData }) => {
  console.log(categoryData ,'category data');
  console.log(videosData ,'videos data');
  console.log(faqsData ,'faqs data');
  const [category, setCategory] = useState(categoryData?.[0]?.slug || '');
  const [faq, setFaq] = useState(faqsData?.[0].id || '');
  const [activeIndex, setActiveIndex] = useState(0);
  const flipsterRef = useRef(null);
  const videosFlipsterOptions = {
    start: 'center',
    loop: true,
    autoplay: 2000,
    pauseOnHover: true,
    style: 'flat',
    nav: false,
    buttons: false,
    scrollwheel: false,
    onItemSwitch: (currentItem) => {
      const newIndex = $(currentItem).index();
      setActiveIndex(newIndex);
    },
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.$ = window.jQuery = $;
      import('jquery.flipster').then(() => {
        $(flipsterRef.current).flipster(videosFlipsterOptions); 
      });
    }

    const heading = document.getElementById('heading');

    const handleMouseMove = (e) => {
      const rect = heading.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      heading.style.background = `radial-gradient(circle at ${x}px ${y}px, #7a95bd 1%, #002B57 20%)`;
      heading.style.backgroundClip = 'text';
    };

    const handleMouseLeave = () => {
      heading.style.background = 'radial-gradient(#002B57, #002B57)';
      heading.style.backgroundClip = 'text';
    };

    heading.addEventListener('mousemove', handleMouseMove);
    heading.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heading.removeEventListener('mousemove', handleMouseMove);
      heading.removeEventListener('mouseleave', handleMouseLeave);
      import('jquery.flipster').then(() => {
        const flipster = $(flipsterRef.current).flipster(videosFlipsterOptions);
        flipster.flipster('destroy');
      })
    };
  }, []);

  const handleDotClick = (index) => {
    import('jquery.flipster').then(() => {
      $(flipsterRef.current).flipster('jump', index);
    })
  };

  const handleArrowClick = (direction) => {
    import('jquery.flipster').then(() => {
      $(flipsterRef.current).flipster(direction);
    })
  };

  const videosOptions = {
    loop: true,
    center: true,
    margin: 0,
    nav: true,
    items: 3, 
    dots: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true
  };

  return (
    <>
      <Box className="banner">
        <Box className="maxWidth">
          <Box className="banner-inner">
            <Box className="banner-text">
              <h1 id="heading">Beyond Ordinary ETFs</h1>
              <p>A lineup that spans disruptive tech, equity income, commodities, and more.</p>

              <Box className="text-scroll">
                <Box className="scrolling-content">
                  <h5>Marketcap</h5>
                  <h5>Smart Beta</h5>
                  <h5>Thematic</h5>
                </Box>
              </Box>
            </Box>

            <Box className="categories">
              <h2 className='text-center'>Explore schemes by category</h2>
              <TabContext value={category}>
                <Box>
                  <TabList 
                    onChange={(e, val) => setCategory(val)} 
                    aria-label="schemes by category"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    {categoryData?.map((ele, index) => {
                      return <Tab key={index} label={ele.title} value={ele.slug} />
                    })}
                  </TabList>
                </Box>
                {categoryData?.map((ele, index) => {
                  return (
                    <TabPanel value={ele.slug} key={index}>
                      <Box className="tab-content">
                        <Box className="left">
                          <h3>{ele.title}</h3>
                          <p>{ele.description}</p>
                          <Button className='custom-btn-icon'>
                            <p>Explore</p>
                            <img src="/link-icon.svg" alt='icon' />
                          </Button>
                        </Box>
                        <Box className="right">
                          <Image
                            src={ele.image_url}
                            alt={ele.title}
                            height={58}
                            width={256}
                          />
                        </Box>
                      </Box>
                    </TabPanel>
                  )
                })}
              </TabContext>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Box className="maxWidth">
        <Box className="videos">
          <h2 className="text-center">Learn More About  ETFs</h2>
          <p className="text-center">Whether you want to learn about investments and their benefits or add to your existing information, there is something for everyone.</p>
          <Box className="videos-slider">
          <OwlCarousel className='owl-theme' {...videosOptions}>
              {videosData.map((video, index) => {
                return (
                  <Box className="videos-card" key={index}>
                    <Box className="videos-image">
                        <img
                          className="main-img"
                          src={video.image_url}
                          alt={video.title}
                        />
                        <img
                          className='youtube-icon'
                          src="/youtube-play.svg"
                          alt="icon"
                        />
                      </Box>
                      <Box className="video-title d-center">
                        <img src="/mirae-round-logo.png" alt='mirae icon' />
                        <h4>{video.title}</h4>
                    </Box>
                  </Box>
                )
              })
              }
          </OwlCarousel>
          </Box>

          {/* <Box className="videos-slider" ref={flipsterRef}>
            <ul>
              {videosData.map((video, index) => {
                return (
                  <li key={index}>
                    <Box className="videos-card">
                      <Box className="videos-image">
                        <img
                          src={video.image_url}
                          alt={video.title}
                        />
                        <img
                          className='youtube-icon'
                          src="/youtube-play.svg"
                          alt="icon"
                        />
                      </Box>
                      <Box className="video-title d-center">
                        <img src="/mirae-round-logo.png" alt='mirae icon' />
                        <h4>{video.title}</h4>
                      </Box>
                    </Box>
                  </li>
                )
              })
              }
            </ul>
            <div className="controls d-center">
              <button className="arrow" onClick={() => handleArrowClick('prev')}><img src="/arrow-left.svg" alt="icon"/></button>
              <div className="dots">
                {videosData.map((ele, index) => (
                  <span
                    key={index}
                    className={`dot ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                  >
                  </span>
                  ))}
              </div>
              <button className="arrow" onClick={() => handleArrowClick('next')}><img src="/arrow-right.svg" alt="icon"/></button>
            </div>
          </Box> */}
        </Box>
      </Box>

      <Box className="faqs">
        <Box className="maxWidth">
          <h2 className="text-center">Know More About ETFs</h2>
          <p className="text-center">Whether you want to learn about investments, there is something for everyone.</p>
          <Box className="faq-content">
            <TabContext value={faq}>
              <Box className="faq-tabs">
                {faqsData?.map((ele, index) => {
                  return <Tab className={faq === ele.id ? "active" : ""} key={index} label={ele.short_title} value={ele.id} onClick={() => setFaq(ele.id)} />
                })}
              </Box>
              <Box className="faq-card">
                {faqsData?.map((ele, index) => {
                  return (
                    <TabPanel value={ele.id} key={index}>
                      <Image
                        src={ele.image_url}
                        alt={ele.title}
                        height={58}
                        width={256}
                        />
                      <h3>{ele.title}</h3>
                      <p>{ele.description}</p>
                    </TabPanel>
                  )
                })}
              </Box>
            </TabContext>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export async function getStaticProps() {
  const data = await fetchAPIOnPageLoad("/schemes", "/videos", "/faqs");
  return {
    props: { 
      categoryData: data[0], 
      videosData: data[1], 
      faqsData: data[2] 
    },
  };
}

export default Home;
