import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    debounce(() => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
          setLoading(true);
          fetchMoreData(page * 10).then((res: any) => {
            const { data } = res;
            setPage((prev) => prev + 1);
            setCount((prev) => prev + data.length);
            setData((prev) => [...prev, ...data]);
            setLoading(false);
          });
        }
      }
    }, 200), // Set the debounce wait time (in milliseconds)
    [page]
  );

  useEffect(() => {
    const scrollRefElement = scrollRef.current;

    if (scrollRefElement) {
      scrollRefElement.addEventListener('scroll', handleScroll);

      return () => scrollRefElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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

  return (
    <div>
      <h1>Scrolling Wrapper</h1>
      <p>Page: {page}</p>
      <p>Count: {count}</p>
      <div
        ref={scrollRef}
        style={{
          overflow: 'auto',
          height: '90vh', // Set the height to less than viewport height
          border: '1px solid black',
        }}>
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
    </div>
  );
};

export default ScrollingWrapper;
