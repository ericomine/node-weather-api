import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly waveHeight: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
  readonly stormGlassApiParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,waveDirection,windSpeed';
  readonly stormGlassApiSource = 'noaa';
  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}}`,
      {
        headers: {
          Authorization: 'fake-token',
        },
      }
    );

    console.log(response.data.hours);

    const result = this.normalizeResponse(response.data);
    return result;
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassApiSource],
      swellHeight: point.swellHeight[this.stormGlassApiSource],
      swellPeriod: point.swellPeriod[this.stormGlassApiSource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassApiSource],
      waveHeight: point.waveHeight[this.stormGlassApiSource],
      windDirection: point.windDirection[this.stormGlassApiSource],
      windSpeed: point.windSpeed[this.stormGlassApiSource],
    }));
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassApiSource] &&
      point.swellHeight?.[this.stormGlassApiSource] &&
      point.swellPeriod?.[this.stormGlassApiSource] &&
      point.waveDirection?.[this.stormGlassApiSource] &&
      point.waveHeight?.[this.stormGlassApiSource] &&
      point.windDirection?.[this.stormGlassApiSource] &&
      point.windSpeed?.[this.stormGlassApiSource]
    );
  }
}
