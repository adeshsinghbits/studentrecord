import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import Logout from 'src/sections/auth/logout';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Logout - ${CONFIG.appName}`}</title>
      </Helmet>

      <Logout />
    </>
  );
}
