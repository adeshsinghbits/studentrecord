import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [

  {
    title: 'Student',
    path: '/student',
    icon: icon('ic-user'),
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: icon('ic-logout'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
