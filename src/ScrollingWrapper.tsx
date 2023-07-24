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
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        fetchMoreData(page * 10).then((res: any) => {
          const { data } = res;
          setPage((prev) => prev + 1);
          setCount((prev) => prev + data.length);
          setData((prev) => [...prev, ...data]);
        });
      }
    }
  }, [page]);

  useEffect(() => {
    const scrollRefElement = scrollRef.current;

    if (scrollRefElement) {
      scrollRefElement.addEventListener('scroll', handleScroll);

      return () => scrollRefElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    console.log('Initial load');
    fetchMoreData(page * 10).then((res: any) => {
      const { data } = res;
      setPage((prev) => prev + 1);
      setCount((prev) => prev + data.length);
      setData((prev) => [...prev, ...data]);
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
          height: '400px',
          border: '1px solid black',
        }}>
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
