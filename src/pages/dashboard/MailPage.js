import { Helmet } from 'react-helmet-async';
// sections
import { Mail } from '../../sections/@dashboard/mail';

// ----------------------------------------------------------------------

export default function MailPage() {
  return (
    <>
      <Helmet>
        <title> Mail | INTERNATIONAL JOURNAL INDEXING</title>
      </Helmet>

      <Mail />
    </>
  );
}
