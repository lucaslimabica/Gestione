import { useEffect, useState } from 'react';
import { 
    Sun, 
    Moon, 
    Cloud, 
    CloudFog, 
    CloudDrizzle, 
    CloudRain, 
    CloudSnow, 
    CloudLightning 
} from 'lucide-react'

type LocationData = {
    lat: number; // Weather param
    lon: number; // Weather param
    city?: string; // UI element
    principalSubdivision?: string; // UI element
    countryName?: string; // UI element
};

type WeatherData = {
    temperature: number;
    is_day: number;
    weathercode: number;
};

interface WeatherDetails {
    Icon: React.ComponentType<{ className?: string }>
    label: string // For more info to the user
}
// Default: Porto Alegre, BR. Used until/unless geolocation
const DEFAULT_LOCATION: LocationData = {
    lat: -30.003652911355164,
    lon: -51.14807163099469,
    city: 'Loading...',
    principalSubdivision: 'Loading...',
    countryName: 'Loading...',
};

const DEFAULT_WEATHER: WeatherData = {
    temperature: 24,
    is_day: 1,
    weathercode: 0,
};

const LocationAndWeather = () => {
    const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
    const [weather, setWeather] = useState<WeatherData>(DEFAULT_WEATHER);

    // Function to reverse-geocode lat/lon into a human-readable loc
    async function getHumanReadableLocation(
        latitude: number,
        longitude: number,
    ): Promise<void> {
        console.log(
            'You are not supposed to see this debug message bro! Getting human-readable location for coords ',
            { latitude, longitude },
        );
        try {
            const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client` +
                    `?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: Partial<LocationData> = await res.json();
            // Merge city/country onto existing coords (keep them intact)
            setLocation((prev) => ({ ...prev, ...data }));
        } catch {
            setLocation((prev) => ({ ...prev, ...{
                city: 'Porto Alegre',
                countryName: 'Brazil',
                principalSubdivision: 'Rio Grande do Sul',
            } }));
        }
    }

    // Function to get the weather for the current lat/lon
    async function getWeather(
        latitude: number,
        longitude: number,
    ): Promise<WeatherData> {
        console.log(
            'You are not supposed to see this debug message bro! Getting weather for coords ',
            { latitude, longitude },
        );
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data: WeatherData = json.current_weather;
            return data; // almost raw data
        } catch {
            console.error(
                'Failed to fetch weather data, returning default weather',
            );
            return {
                temperature: 24,
                is_day: 1,
                weathercode: 0,
            };
        }
    }

    function getWeatherDetails(weatherData: WeatherData): WeatherDetails {
        const code = weatherData.weathercode;
        const isDay = weatherData.is_day;
    
        switch (code) {
            // --- CLEAR SKY & MAINLY CLEAR ---
            case 0:
            case 1:
                return isDay 
                    ? { Icon: Sun, label: code === 0 ? 'Clear' : 'Mostly Clear' }
                    : { Icon: Moon, label: code === 0 ? 'Clear' : 'Mostly Clear' }
        
            // --- CLOUDY STAGES ---
            case 2:
                return { Icon: Cloud, label: 'Partly Cloudy' }
            case 3:
                return { Icon: Cloud, label: 'Overcast' }
        
            // --- FOG ---
            case 45:
            case 48:
                return { Icon: CloudFog, label: code === 45 ? 'Fog' : 'Icy Fog' }
        
            // --- DRIZZLE & FREEZING DRIZZLE ---
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                return { Icon: CloudDrizzle, label: 'Drizzle' }
        
            // --- RAIN & RAIN SHOWERS ---
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                return { Icon: CloudRain, label: 'Rain' }
        
            // --- SNOW, SNOW GRAINS & SNOW SHOWERS ---
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                return { Icon: CloudSnow, label: 'Snow' }
        
            // --- THUNDERSTORMS & HAIL ---
            case 95:
            case 96:
            case 99:
                return { Icon: CloudLightning, label: 'Thunderstorm' }
        
            // --- FALLBACK ---
            default:
                return { Icon: Cloud, label: 'Unknown' }
        }
    }

    // On mount, get geolocation and update state (which triggers UI update). If geolocation fails/denied, keep default location
    useEffect(() => {
        if (!('geolocation' in navigator)) return;
        // Runs only if geolocation is supported by the browser. Otherwise keep default location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Updates only lat/lon with the prev, that onlys updates what is sent outside the "...prev"
                setLocation((prev) => ({
                    ...prev,
                    lat: latitude,
                    lon: longitude,
                }));

                // Reverse-geocode to get a human-readable name for the UI
                await getHumanReadableLocation(latitude, longitude);
                let currentWeather = await getWeather(latitude, longitude);
                setWeather(currentWeather); 
                console.log("Clima tratatado", currentWeather);
            },
            () => {
                setLocation((prev) => ({ ...prev, ...{
                    city: 'Porto Alegre',
                    countryName: 'Brazil',
                    principalSubdivision: 'Rio Grande do Sul',
                } }));
            }, // permission denied, so update the DEFAULT_LOCATION to the mock
        );
    }, []); // empty deps array, so run only once on mount

    const { Icon, label } = getWeatherDetails(weather);

    return (
        <div className="text-sm flex items-center gap-2" title={label}>
            <Icon className="w-[16px] h-[16px] text-primary" />
            <span className="text-sm">
                {location.city ?? '?'}
            </span>
        </div>
    );
};

export default LocationAndWeather;
