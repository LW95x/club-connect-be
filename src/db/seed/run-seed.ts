import { clubsData, fansData, eventsData, ordersData } from '../data/index';
import seed from "./seed";
import db from '../connection';

const runSeed = () => {
  return seed({clubsData, fansData, eventsData, ordersData}).then(() => db.end());
};

runSeed();
