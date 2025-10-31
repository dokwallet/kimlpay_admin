'use client';
import React, { useCallback, useRef, useState } from 'react';
import s from './Tutorial.module.css';
import { Carousel } from 'react-responsive-carousel';
import { getVideos } from '@/whitelabel/whiteLabelInfo';
import Image from 'next/image';
import { PlayArrow } from '@mui/icons-material';
import HorizontalScroller from '@/components/HorizontalScroller';

const Tutorial = () => {
  const videoRefs = useRef([]);
  const carouselRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSlideChange = useCallback(index => {
    // Pause all videos first
    setSelectedIndex(index);
    videoRefs.current.forEach(videoRef => {
      if (videoRef) {
        videoRef.pause();
      }
    });

    // Play the active video
    if (videoRefs.current[index] && videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  }, []);

  const onClickVideo = useCallback(index => {
    setSelectedIndex(index);
  }, []);

  return (
    <div className={s.mainContainer}>
      {/*<div key={`videos_${index}`}>*/}

      <Carousel
        ref={carouselRef}
        selectedItem={selectedIndex}
        showArrows={true}
        showStatus={false}
        showIndicators={false}
        onChange={onSlideChange}>
        {getVideos().map((item, index) => {
          return (
            <div className={s.videoContainer} key={`videos_${index}`}>
              <video
                ref={ref => (videoRefs.current[index] = ref)}
                className={s.videoStyle}
                src={item.video_url}
                poster={item.thumbnail_url}
                controls={true}></video>
            </div>
          );
        })}
      </Carousel>
      <HorizontalScroller>
        {getVideos().map((item, index) => {
          return (
            <div className={s.thumbnailContainer} key={`vide_thumb_${index}`}>
              <div
                className={`${s.imageView} ${selectedIndex === index && s.selectedImage}`}>
                <>
                  <Image
                    className={s.imageStyle}
                    src={item.thumbnail_url}
                    key={`thunb_${index}`}
                    alt={'thumb'}
                    width={180}
                    height={100}
                  />
                  <button
                    className={`${s.overView}`}
                    aria-label='playButton'
                    onClick={() => {
                      onClickVideo(index);
                    }}>
                    <PlayArrow />
                  </button>
                </>
              </div>
              <div className={s.previewLabel}>{item.label || ''}</div>
            </div>
          );
        })}
      </HorizontalScroller>
    </div>
  );
};

export default Tutorial;
