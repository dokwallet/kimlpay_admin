let router = null;
let currentRoute = '';

export const setRouter = localRouter => {
  router = localRouter;
};

export const setCurrentRoute = localCurrentRoute => {
  currentRoute = localCurrentRoute;
};

export const replaceRoute = (url, replaceOnlyWhenRouteSame = false) => {
  if (!replaceOnlyWhenRouteSame) {
    router.replace(url);
  } else if (replaceOnlyWhenRouteSame && url.split('?')[0] === currentRoute) {
    router.replace(url);
  }
};

export const pushRoute = url => {
  router.replace(url);
};
