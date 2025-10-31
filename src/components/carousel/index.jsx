import React from 'react';

const Carousel = () => {
  return (
    <>
      <div className='carousel'>
        <div>
          <div className='BrainhubCarousel'>
            <div className='BrainhubCarousel__trackContainer'>
              <ul
                className='BrainhubCarousel__track BrainhubCarousel__track--draggable'
                style={{
                  marginLeft: '0',
                  width: '1012px',
                  transform: 'translateX(0px)',
                }}>
                <li
                  className='BrainhubCarouselItem BrainhubCarouselItem--active'
                  style={{
                    paddingRight: '0',
                    paddingLeft: '0',
                    width: '506px',
                    maxWidth: '506px',
                    minWidth: '506px',
                  }}>
                  <div className='TestimonialCarousel_testimonial__+glCo item'>
                    <div className='TestimonialCarousel_imageContainer__tNZlt'>
                      {/*<Ima src='' alt='Jane Ma' />*/}
                    </div>
                    <div className='TestimonialCarousel_quote__VqdVb'>“</div>
                    <div className='TestimonialCarousel_message__Jycv0'>
                      I was really impressed with what Reap offered, their
                      vision, also their startup mentality. I resonated with the
                      way they do things. It was one of the best decisions we’ve
                      made.
                    </div>
                    <div className='TestimonialCarousel_name__SGrUi'>
                      Jane Ma
                    </div>
                    <div className='TestimonialCarousel_role__LodFV'>
                      Co-Founder and Co-Project Lead of zkLend
                    </div>
                  </div>
                </li>
                <li
                  className='BrainhubCarouselItem'
                  style={{
                    paddingRight: '0',
                    paddingLeft: '0',
                    width: '506px',
                    maxWidth: '506px',
                    minWidth: '506px',
                  }}>
                  <div className='TestimonialCarousel_testimonial__+glCo item'>
                    <div className='TestimonialCarousel_imageContainer__tNZlt'>
                      {/*<img*/}
                      {/*  src='/aa912f1/static/media/gnosis-white.43f7b66cb5d88d46c65e.png'*/}
                      {/*  alt='Gnosis'*/}
                      {/*/>*/}
                    </div>
                    <div className='TestimonialCarousel_quote__VqdVb'>“</div>
                    <div className='TestimonialCarousel_message__Jycv0'>
                      Reap’s solution has been particularly useful for bypassing
                      the difficulties that often come with trying to use
                      cryptocurrency to navigate the traditional banking system
                    </div>
                    <div className='TestimonialCarousel_name__SGrUi'>
                      Gnosis
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='Dots_container__AR0rz'>
          <button
            className='Dots_dot__gH9TM Dots_active__DVnl6'
            type='button'
            aria-label='.'></button>
          <button
            className='Dots_dot__gH9TM'
            type='button'
            aria-label='.'></button>
        </div>
      </div>
      {/*<div className='sc-hTtIkV fJFjks'>*/}
      {/*  20,000+ customers trust us with their payments*/}
      {/*</div>*/}
    </>
  );
};

export default Carousel;
