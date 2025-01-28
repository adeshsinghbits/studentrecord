import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StudentView } from '../sections/user/view/user-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Student - ${CONFIG.appName}`}</title>
      </Helmet>

      <StudentView />
    </>
  );
}
