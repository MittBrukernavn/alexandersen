import React, { useState } from 'react';

import Background from '../../general/Background';
import Body from '../../general/Body';

const Yelp = () => {
  const [review, setReview] = useState('');
  const [verdict, setVerdict] = useState('');

  const inferSentiment = async () => {
    if (!review) {
      setVerdict('Please enter a review for analysis');
      return;
    }
    const res = await fetch(`/pyapi/yelp/${review}`);
    const t = await res.text();
    const prob = parseFloat(t);
    if (prob < 0.1) {
      setVerdict(`Very negative review (${t})`);
    } else if (prob < 0.5) {
      setVerdict(`Somewhat negative review (${t})`);
    } else if (t === '0.6575687527656555') {
      setVerdict(`Very positive review (${t}). WARNING: This probability is indicative
        that the words you chose are not in the model's vocabulary.`);
    } else if (prob < 0.9) {
      setVerdict(`Somewhat positive review (${t})`);
    } else {
      setVerdict(`Very positive review (${t})`);
    }
  };

  return (
    <Background>
      <h1>Review sentiment analysis</h1>
      <Body>
        <input
          type="text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button
          type="button"
          onClick={inferSentiment}
        >
          Good or bad?
        </button>
        {
          verdict ? <p>{ verdict }</p> : null
        }
      </Body>
    </Background>
  );
};

export default Yelp;
