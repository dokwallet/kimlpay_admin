const NextBugfender = {
  init: async () => {
    try {
      const { Bugfender } = await import('@bugfender/sdk');
      const BUGFENDER_APP_KEY = process.env.BUGFENDER_APP_KEY;
      const KIML_ENV = process.env.KIML_ENV;
      if (!BUGFENDER_APP_KEY || KIML_ENV === 'DEVELOPMENT') {
        console.warn(
          'No bugfender key found or bugfender is disabled in development',
        );
        return;
      }
      await Bugfender.init({
        appKey: BUGFENDER_APP_KEY,
        logUIEvents: false,
        logBrowserEvents: false,
        enableLogcatLogging: false, // Android specific
        printToConsole: false,
      });
    } catch (e) {
      console.error('error in Bugfender init', e);
    }
  },
  setDeviceKey: async email => {
    const { Bugfender } = await import('@bugfender/sdk');
    Bugfender.setDeviceKey('user_email', email);
  },
};

export default NextBugfender;
