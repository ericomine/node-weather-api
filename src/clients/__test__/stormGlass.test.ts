import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormGlassWeather3HoursNormalizedFixture from '@test/fixtures/stormglass_weather_3_hours_normalized.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = 23.5324539;
    const long = -45.2175029;

    axios.get = jest.fn().mockResolvedValue(stormGlassWeather3HoursFixture);

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual(stormGlassWeather3HoursNormalizedFixture);
  });
});
