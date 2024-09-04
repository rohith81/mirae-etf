import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'jquery.flipster/dist/jquery.flipster.min.css';

import * as React from 'react';

import { Box, Button, FormControl, MenuItem, Select, Tab, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from 'react';

import $ from 'jquery';
import Image from 'next/image';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import dynamic from 'next/dynamic';
import fetchAPIOnPageLoad from '@/utils/fetchApi';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

const useRefWithConsole = (initialValue) => {
  const ref = useRef(initialValue);
  const callbackRef = useRef();

  const setRef = useCallback((value) => {
    ref.current = value;
    if (callbackRef.current) {
      callbackRef.current(value);
    }
  }, []);

  return [ref, setRef];
}

const featuredEtfData = [
  {
    id: "1",
    title: "Nifty MidSmallcap400 Momentum Quality 100 ETF",
    category: "MIDSMALL"
  },
  {
    id: "2",
    title: "Mirae Asset Nifty 50 ETF",
    category: "MIDSMALL"
  },
  {
    id: "3",
    title: "Mirae Asset Nifty Next 50 ETF",
    category: "MIDSMALL"
  },
  {
    id: "4",
    title: "Mirae Asset Nifty Financial Services ETF",
    category: "MIDSMALL"
  },
  {
    id: "5",
    title: "Mirae Asset Nifty 100 ESG Sector Leaders ETF",
    category: "MIDSMALL"
  }
];

const Home = ({ categoryData, videosData, faqsData }) => {
  // console.log(categoryData ,'category data');
  // console.log(videosData ,'videos data');
  // console.log(faqsData ,'faqs data');
  // const flipsterRef = useRef(null);
  const [category, setCategory] = useState(categoryData?.[0]?.slug || '');
  const [faq, setFaq] = useState(faqsData?.[0].id || '');
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentIndexRef, setCurrentIndexRef] = useRefWithConsole(0);
  const dotsRef = useRef([]);
  const [cagrDuration, setCAGRDuration] = useState('5Y');
  const [selectedFeaturedEtf, setSelectedFeaturedEtf] = useState(featuredEtfData[0]);
  const [etfData, setEtfData] = useState([]);
  const inavValuesRef = useRef({});
  console.log(etfData, 'etfs data');

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
    // if (typeof window !== 'undefined') {
    //   window.$ = window.jQuery = $;
    //   import('jquery.flipster').then(() => {
    //     $(flipsterRef.current).flipster(videosFlipsterOptions); 
    //   });
    // }

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
      // import('jquery.flipster').then(() => {
      //   const flipster = $(flipsterRef.current).flipster(videosFlipsterOptions);
      //   flipster.flipster('destroy');
      // })
    };
  }, []);

  // const handleDotClick = (index) => {
  //   import('jquery.flipster').then(() => {
  //     $(flipsterRef.current).flipster('jump', index);
  //   })
  // };

  // const handleArrowClick = (direction) => {
  //   import('jquery.flipster').then(() => {
  //     $(flipsterRef.current).flipster(direction);
  //   })
  // };

  if (typeof window !== 'undefined') {
    window.$ = window.jQuery = $;
  }

  const etfsOptions = {
    loop: true,
    center: false,
    margin: 10,
    items: 5,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplaySpeed: 3000,
    autoplayHoverPause: true,
  };

  const videosOptions = {
    loop: true,
    center: true,
    margin: 0,
    items: 3,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    onTranslated: (event) => {
      let newIndex = event.item.index - event.relatedTarget._clones.length / 2;
      if (newIndex >= event.item.count) {
        newIndex = newIndex - event.item.count;
      }
      if (newIndex < 0) {
        newIndex = event.item.count + newIndex;
      }
      setCurrentIndexRef(newIndex);
      updateActiveDot(newIndex);
    }
  };

  const goToPrev = () => {
    var owl = $('.owl-carousel');
    owl.trigger('prev.owl.carousel');
  };

  const goToNext = () => {
    var owl = $('.owl-carousel');
    owl.trigger('next.owl.carousel');
  };

  const goToIndex = (index) => {
    var owl = $('.owl-carousel');
    owl.trigger('to.owl.carousel', [index]);
  };


  const updateActiveDot = (index) => {
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        dot.classList.toggle('active', i === index);
      }
    });
  };

  useEffect(() => {
    updateActiveDot(currentIndexRef.current);
  }, [currentIndexRef.current]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cms-dev.mirae.webileapps.io/wp-json/mirae/v1/stock-data');
        const fetchedData = response.data;
        setEtfData(fetchedData);

        const initialValues = {};
        fetchedData.forEach((ele) => {
          initialValues[ele.SchemeCode] = {
            INAV: ele.INAV,
            Per_Change_of_INAV: ele.Per_Change_of_INAV
          };
        });
        inavValuesRef.current = initialValues;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(async () => {
      try {
        const response = await axios.get('https://cms-dev.mirae.webileapps.io/wp-json/mirae/v1/stock-data');
        const fetchedData = response.data;
        console.log(fetchedData, 'interval data')

        fetchedData.forEach((ele) => {
          if (inavValuesRef.current[ele.SchemeCode]) {
            inavValuesRef.current[ele.SchemeCode].INAV = ele.INAV;
            inavValuesRef.current[ele.SchemeCode].Per_Change_of_INAV = ele.Per_Change_of_INAV;
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Box className="banner">
        <Box className="maxWidth">
          <Box className="banner-inner">
            <Box className="etf-slider">
              <Box className="etf-slider-inner">
                <OwlCarousel className='owl-theme' {...etfsOptions}>
                  {etfData.map((ele, index) => {
                    const formattedINavChange = parseFloat(inavValuesRef.current[ele.SchemeCode]?.Per_Change_of_INAV.replace('%', '')).toFixed(2);
                    return (
                      <Box
                        key={index}
                        className="etfs-card d-center"
                        onClick={() => { }}
                      >
                        <Box className="etf-icon">
                          <img src="/mirae-round-logo.png" alt='icon' />
                        </Box>
                        <Box className="etf-text">
                          <h4>{ele.ETF}</h4>
                          <p>
                            <span className='nav'>iNAV</span> {inavValuesRef.current[ele.SchemeCode]?.INAV}
                            <span className='inr'>INR .</span>
                            {formattedINavChange > 0 ?
                              <span className='gain'>+{formattedINavChange}%</span> :
                              formattedINavChange < 0 ?
                                <span className='loss'>{formattedINavChange}%</span> :
                                <span className='gain'>0%</span>
                            }
                          </p>
                        </Box>
                      </Box>
                    )
                  })}
                </OwlCarousel>
              </Box>
            </Box>

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
                          <button className='custom-btn-icon'>
                            <p>Explore</p>
                            <img src="/link-icon.svg" alt='icon' />
                          </button>
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

      <Box className="featured_etfs">
        <Box className="maxWidth common-padding">
          <h2 className="text-center">Discover our approach to thematic and income investing</h2>
          <p className="text-center">View our full lineup of more than 80 ETFs</p>
          <h4>FEATURED ETFs</h4>
          <Box className="featured_etfs_content d-flex j-center">
            <Box className="left">
              {featuredEtfData.map((etf, index) => (
                <Box
                  key={index}
                  className={`featured_etf_title ${etf.id === selectedFeaturedEtf.id ? 'active' : ''}`}
                  onClick={() => setSelectedFeaturedEtf(etf)}
                >
                  <Box className="featured_etf_title_inner">
                    <img src={`/icon${index + 1}.png`} alt='icon' />
                    <Box className="title">
                      <h5>Mirae Asset</h5>
                      <h3>{etf.title}</h3>
                      <p>{etf.category}</p>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className="right">
              <Box className="title">
                <h5>Mirae Asset</h5>
                <h3>{selectedFeaturedEtf.title}</h3>
              </Box>
              <p className="description">
                An open ended  scheme replicating/tracking Nifty 50 Index (NSE: NIFTYETF BSE:542131)
              </p>
              <Box className="cagr-nav">
                <Box className="cagr">
                  <p>CAGR Returns</p>
                  <Box className="d-center">
                    <h5>19.98%</h5>
                    <FormControl variant="filled">
                      <Select
                        labelId="cagr-duration-label"
                        id="cagr-duration"
                        value={cagrDuration}
                        onChange={(event) => setCAGRDuration(event.target.value)}
                      >
                        <MenuItem value='1Y'>1Y</MenuItem>
                        <MenuItem value='3Y'>3Y</MenuItem>
                        <MenuItem value='5Y'>5Y</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box className="nav-details">
                  <p>NAV: as on 12th Jul, 2024</p>
                  <p className='value d-center'>
                    <span className='nav'>₹91.05</span>
                    <span className='nav_change d-center'>
                      <img src="/gain-icon.svg" alt='icon' />
                      ₹4.32 (10.3%)
                    </span>
                  </p>
                </Box>
              </Box>
              <Box className="benchmark_risk d-flex">
                <Box>
                  <p>Benchmark</p>
                  <h3>Domestic Price of Goal</h3>
                </Box>
                <Box>
                  <p>Risk</p>
                  <h3 style={{ color: '#D93B3B' }}>Aggressive</h3>
                </Box>
              </Box>
              <Box className="btns d-center">
                <button className="custom-btn white-bg">KNOW MORE</button>
                <button className="custom-btn-icon">
                  <p>INVEST</p>
                  <img src="/link-icon.svg" alt='icon' />
                </button>
              </Box>
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
                  <Box
                    key={index}
                    className="videos-card"
                  // onClick={() => window.open(video.video_link, '_blank', 'noopener,noreferrer')}
                  >
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
              })}
            </OwlCarousel>
            <div className="custom-nav">
              <button className="custom-prev" onClick={goToPrev}><img src="/arrow-left.svg" alt='icon' /></button>
              <div className="custom-dots">
                {videosData.map((_, index) => (
                  <button
                    key={index}
                    ref={el => dotsRef.current[index] = el}
                    className={`dot ${index === currentIndexRef.current ? 'active' : ''}`}
                    onClick={() => goToIndex(index)}
                  >
                  </button>
                ))}
              </div>
              <button className="custom-next" onClick={goToNext}><img src="/arrow-right.svg" alt='icon' /></button>
            </div>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <button className='custom-btn-icon blue'>
              <p>View All</p>
              <img src="/link-icon.svg" alt='icon' />
            </button>
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
                  return <Tab
                    className={faq === ele.id ? "active" : ""}
                    key={index}
                    label={<div className="d-center j-between w-100">
                      {`${(index + 1).toString().padStart(2, '0')}. ${ele.short_title}`}
                      <img src={faq === ele.id ? "/tab-right-orange.svg" : "/tab-right.svg"} />
                    </div>}
                    value={ele.id}
                    onClick={() => setFaq(ele.id)}
                    disableRipple
                  />
                })}

                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <button className='custom-btn-icon blue'>
                    <p>View All</p>
                    <img src="/link-icon.svg" alt='icon' />
                  </button>
                </Box>
              </Box>
              <Box className="faq-card">
                {/* {faqsData?.map((ele, index) => {
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
                })} */}
                {faqsData.map((ele, index) => {
                  return (
                    <TabPanel value={ele.id} key={index}>
                      <Box
                        key={index}
                        className="videos-card"
                      >
                        <Box className="videos-image">
                          <img
                            onClick={() => window.open(ele.video_link, '_blank', 'noopener,noreferrer')}
                            className="main-img"
                            src={ele.image_url}
                            alt={ele.title}
                          />
                          <img
                            className='youtube-icon'
                            src="/youtube-play.svg"
                            alt="icon"
                          />
                        </Box>
                        <Box className="video-title d-center" mb={1}>
                          <img src="/mirae-round-logo.png" alt='mirae icon' />
                          <h4>{ele.title}</h4>
                        </Box>
                        <p>{ele.description}</p>
                        <Box sx={{ display: "flex", mt: 2 }}>
                          <button className='custom-btn-icon'>
                            <p>Read More</p>
                            <img src="/link-icon.svg" alt='icon' />
                          </button>
                        </Box>
                      </Box>
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
  const data = await fetchAPIOnPageLoad("/schemes", "/videos", "/faqs", "/stock-data");
  return {
    props: {
      categoryData: data[0],
      videosData: data[1],
      faqsData: data[2],
    },
  };
}

export default Home;
