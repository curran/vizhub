export const showUpvote = true;
export const showHeadShare = true;
export const showCollaborators = true;
export const showCollaboratorsAnyoneCanEdit = true;
export const showCollaboratorsManagement = true;

export const showPricing = true;
export const showEmbed = true;
export const showNeoNavBar = true;

export const showDownvote = false;
export const showCreatedDate = false;
export const showHeadPullRequest = false;
export const showVideoThumbnail = false;
export const showVisualEditor = false;
export const showMobileConsole = false;
export const renameFileWithoutPath = false;
export const enableWhiteLabelEmbeding = false;
export const enablePreviewEmbeding = false;
export const showSortOptions = true;
export const showForksCount = true;

export const showAboutLink = true;
export const lintJs = false;

export const showFacebookLogin = false;
export const showGoogleLogin = false;

export const showUserActionsMenuCreateViz = true;
export const showUserActionsProfile = true;

// List of usernames who have access to
// private viz feature.
const core = ['ci'];

const professors = ['Razpudding', 'sjengle', 'nazareno'];

const stamen = [
  'vinaydixit',
  'almccon',
  'alecburch',
  'swvogt',
  'loganwilliams',
  'colinsullivan',
  'schroedermarc',
  'aaamira',
];

// 1 Year of VizHub Pro
const kickstarter = [
  'KoSMik9',
  'afraser',
  'alangwilson',
  'mochabits',
  'JunyanL',
  'leonardsip',
  'pfmiriks',
  'romkey',
  'rdwong',
  'kirkdebaets',
  'tejbir-singh',
  'mrwatson-de',
];

// Backers who get 2 years of "VizHub Pro".
const kickstarter2years = [
  'seemantk',
  'aarondake', // Did not select reward but gave $300
  'mbsmrtic', // Did not select reward but gave $100
];

const whitelist = core
  .concat(professors)
  .concat(stamen)
  .concat(kickstarter)
  .concat(kickstarter2years);

const userCanHavePrivateViz = (user) =>
  user && (user.plan === 'pro' || whitelist.includes(user.userName));

// Gateway to the private viz feature.
export const showPrivacySettings = (me, vizInfo) =>
  me ? vizInfo.owner === me.id && userCanHavePrivateViz(me) : false;

// Only show the profile sidebar if:
// * The logged in user has access to private viz feature, and
// * The logged in user is viewing their own profile.
export const showProfileSidebar = (profileUser, me) =>
  me ? profileUser.id === me.id && userCanHavePrivateViz(me) : false;
