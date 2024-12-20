// OpenWeather APIのキー
// 注意: 本番環境では、APIキーをバックエンドサーバーで管理することを推奨します
const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM要素の取得
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const weatherDescriptionElement = document.getElementById("weatherDescription");
const humidityElement = document.getElementById("humidity");
const weatherIconElement = document.getElementById("weatherIcon");

// デフォルトのアイコンを設定
weatherIconElement.src = "https://openweathermap.org/img/wn/02d@2x.png";

// 天気情報を取得する関数
async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=ja`);
        if (!response.ok) {
            throw new Error("天気情報の取得に失敗しました");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("エラー:", error);
        alert("天気情報の取得に失敗しました。都市名を確認してください。");
        // エラー時のデフォルト表示
        locationElement.textContent = "エラーが発生しました";
        temperatureElement.textContent = "--";
        weatherDescriptionElement.textContent = "--";
        humidityElement.textContent = "--";
        weatherIconElement.src = "https://openweathermap.org/img/wn/02d@2x.png";
    }
}

// 天気情報を表示する関数
function displayWeatherData(data) {
    if (!data) return;

    try {
        locationElement.textContent = data.name;
        temperatureElement.textContent = Math.round(data.main.temp);
        weatherDescriptionElement.textContent = data.weather[0].description;
        humidityElement.textContent = data.main.humidity;

        // アイコンのURLを構築して設定
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIconElement.src = iconUrl;
        weatherIconElement.alt = data.weather[0].description;
    } catch (error) {
        console.error("データの表示中にエラーが発生しました:", error);
        // エラー時のデフォルト表示
        locationElement.textContent = "データの表示に失敗しました";
        temperatureElement.textContent = "--";
        weatherDescriptionElement.textContent = "--";
        humidityElement.textContent = "--";
        weatherIconElement.src = "https://openweathermap.org/img/wn/02d@2x.png";
    }
}

// 位置情報から天気を取得する関数
async function getWeatherByGeolocation(position) {
    try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ja`);
        if (!response.ok) {
            throw new Error("天気情報の取得に失敗しました");
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error("エラー:", error);
        alert("現在地の天気情報の取得に失敗しました");
        handleGeolocationError(error);
    }
}

// 位置情報の取得に失敗した場合の処理
function handleGeolocationError(error) {
    console.error("位置情報の取得に失敗:", error);
    locationElement.textContent = "デフォルトの都市";
    getWeatherData("Tokyo").then(displayWeatherData);
}

// 検索ボタンのクリックイベント
searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city).then((data) => {
            if (data) displayWeatherData(data);
        });
    } else {
        alert("都市名を入力してください");
    }
});

// Enterキーでの検索
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city).then((data) => {
                if (data) displayWeatherData(data);
            });
        } else {
            alert("都市名を入力してください");
        }
    }
});

// 初期化処理
function init() {
    // デフォルトのアイコンを設定
    weatherIconElement.src = "https://openweathermap.org/img/wn/02d@2x.png";

    // 位置情報の取得を試みる
    if (navigator.geolocation) {
        locationElement.textContent = "位置情報を取得中...";
        navigator.geolocation.getCurrentPosition(getWeatherByGeolocation, handleGeolocationError);
    } else {
        handleGeolocationError(new Error("Geolocation is not supported"));
    }
}

// アプリの初期化
init();
