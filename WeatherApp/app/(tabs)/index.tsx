import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

interface WeatherData {
  name: string;
  temperature: number;
  country: string;
  weather: string;
  icon: string;
}

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (city.trim().length > 0) {
        fetchWeather();
      } else {
        setWeatherData(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [city]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchWeather = () => {
    setLoading(true);
    setError(null);
    const apiUrl = `http://192.168.99.114:5000/weather?city=${city}`;

    axios.get(apiUrl)
      .then(response => {
        const { main, name, weather, sys } = response.data;
        const icon = weather[0].icon;

        setWeatherData({
          name,
          temperature: main.temp,
          country: sys.country,
          weather: capitalizeFirstLetter(weather[0].description),
          icon,
        });
      })
      .catch(error => {
        setError('Cidade não encontrada');
        setWeatherData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTextChange = (text: string) => {
    setCity(text);
  };

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <Text style={styles.title}>Previsão do Tempo</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da cidade"
          placeholderTextColor="#c4c4c4"
          value={city}
          onChangeText={handleTextChange}
        />
      </View>
      {loading && <ActivityIndicator size="large" color="#fff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      {weatherData && (
        <View style={styles.weatherInfo}>
          <Text style={styles.location}>{weatherData.name}</Text>
          <Text style={styles.temperature}>{weatherData.temperature.toFixed(0)}°C</Text>
          <Text style={styles.country}>{weatherData.country}</Text>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${weatherData.icon}.png` }}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
          <Text style={styles.weather}>{weatherData.weather}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#ffffff50',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    textAlign: 'center',
    paddingHorizontal: 12,
    color: 'white',
    fontSize: 18,
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginVertical: 10,
  },
  loading: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  error: {
    fontSize: 20,
    color: 'red',
    marginBottom: 10,
  },
  weatherInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff50',
    borderRadius: 10,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 24,
    color: 'white',
    marginBottom: 5,
  },
  country: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
  weather: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
});

export default App;
