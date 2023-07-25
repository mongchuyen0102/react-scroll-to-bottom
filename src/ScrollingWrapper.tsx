import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

const fetchMoreData = (offset: number) => {
  console.log('fetchMoreData', offset);
  const data = Array.from({ length: 10 }, (_, i) => i + offset);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ offset, data });
    }, 1000);
  });
};

const ScrollingWrapper = () => {
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [data, setData] = useState<number[]>([]); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [loading, setLoading] = useState(false); // Add the loading state

  const handleScroll = useCallback(
    debounce(() => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
        setLoading(true); // Set loading to true before fetch
        fetchMoreData(page * 10).then((res: any) => {
          const { data } = res;
          setPage((prev) => prev + 1);
          setCount((prev) => prev + data.length);
          setData((prev) => [...prev, ...data]);
          setLoading(false); // Set loading back to false after fetch is complete
        });
      }
    }, 200), // Set the debounce wait time (in milliseconds)
    [page, loading] // Include all dependencies used inside the debounced function
  );

  useEffect(() => {
    console.log('Initial load');
    setLoading(true); // Set loading to true before fetch
    fetchMoreData(page * 10).then((res: any) => {
      const { data } = res;
      setPage((prev) => prev + 1);
      setCount((prev) => prev + data.length);
      setData((prev) => [...prev, ...data]);
      setLoading(false); // Set loading back to false after fetch is complete
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h1>Scrolling Wrapper</h1>
      <p>Page: {page}</p>
      <p>Count: {count}</p>
      <div style={{ height: '110vh' }}>
        {/* Increase height here for more content */}
        {data.map((item) => (
          <p
            style={{
              border: '1px solid black',
              padding: '1rem',
              margin: '1rem',
            }}
            key={item}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ScrollingWrapper;
