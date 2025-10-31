import React, { useEffect, useState } from 'react';
import style from './RightPanel.module.css';
import { getQuotes, getVideos } from '@/whitelabel/whiteLabelInfo';
import { Carousel } from 'react-responsive-carousel';

const RightPanel = ({ showVideo }) => {
  const quotesList = getQuotes();

  return (
    <div className={style.sidePanel}>
      {showVideo && (
        <video
          className={style.videoStyle}
          src={getVideos()?.[0]?.video_url}
          poster={getVideos()?.[0]?.thumbnail_url}
          controls={true}
        />
      )}
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        stopOnHover={true}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        autoPlay={true}>
        {quotesList.map((item, index) => (
          <div className={style.quoteContainer} key={'quote_' + index}>
            <div className={style.quoteIcon}>“</div>
            <p className={style.quote}>{item?.title}</p>
            <p className={style.author}>{item?.author}</p>
            <p className={style.designation}>{item?.designation}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default RightPanel;
