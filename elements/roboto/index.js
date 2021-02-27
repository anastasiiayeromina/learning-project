export const Roboto = () => (
  <>
    <link rel='preload' href='/fonts/roboto/roboto-v20-latin-regular.woff2' as='font' crossOrigin='anonymous' />
    <link rel='preload' href='/fonts/roboto/roboto-v20-latin-700.woff2' as='font' crossOrigin='anonymous' />
    <link rel='preload' href='/fonts/roboto/roboto-v20-latin-300.woff2' as='font' crossOrigin='anonymous' />
    {/* eslint-disable-next-line react/no-danger */}
    <style dangerouslySetInnerHTML={{
      __html: `
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          unicode-range: U+000-5FF;
          src: local('Roboto Regular'), local('Roboto-Regular'),
            url('/fonts/roboto/roboto-v20-latin-regular.woff2') format('woff2'),
            url('/fonts/roboto/roboto-v20-latin-regular.woff') format('woff');
        }
        
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          unicode-range: U+000-5FF;
          src: local('Roboto Bold'), local('Roboto-Bold'),
            url('/fonts/roboto/roboto-v20-latin-700.woff2') format('woff2'),
            url('/fonts/roboto/roboto-v20-latin-700.woff') format('woff');
        }
        
        @font-face {
          font-family: 'Roboto';
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          unicode-range: U+000-5FF;
          src: local('Roboto Light'), local('Roboto-Light'),
            url('/fonts/roboto/roboto-v20-latin-300.woff2') format('woff2'),
            url('/fonts/roboto/roboto-v20-latin-300.woff') format('woff');
        }
      `,
    }}
    />
  </>
);