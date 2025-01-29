class TokenStorage {
    constructor() {
        this.storage = new Map();
        this.expirationIntervals = new Map();
    }

    // Сохранение токена с временем истечения
    setToken(username, tokenType, token, expiresIn) {
        const key = `${username}:${tokenType}`;
        const expiresAt = Date.now() + expiresIn * 1000;

        const tokenData = {
            token,
            expiresAt
        };

        this.storage.set(key, tokenData);

        // Установка таймера для автоматического удаления
        if (this.expirationIntervals.has(key)) {
            clearTimeout(this.expirationIntervals.get(key));
        }

        const timeoutId = setTimeout(() => {
            this.storage.delete(key);
            this.expirationIntervals.delete(key);
        }, expiresIn * 1000);

        this.expirationIntervals.set(key, timeoutId);
    }

    // Получение токена
    getToken(username, tokenType) {
        const key = `${username}:${tokenType}`;
        const tokenData = this.storage.get(key);

        if (!tokenData) {
            return null;
        }

        // Проверка срока действия
        if (Date.now() > tokenData.expiresAt) {
            this.storage.delete(key);
            this.expirationIntervals.delete(key);
            return null;
        }

        return tokenData.token;
    }

    // Удаление всех токенов пользователя
    clearUserTokens(username) {
        const accessKey = `${username}:access_token`;
        const refreshKey = `${username}:refresh_token`;

        this.storage.delete(accessKey);
        this.storage.delete(refreshKey);

        if (this.expirationIntervals.has(accessKey)) {
            clearTimeout(this.expirationIntervals.get(accessKey));
            this.expirationIntervals.delete(accessKey);
        }

        if (this.expirationIntervals.has(refreshKey)) {
            clearTimeout(this.expirationIntervals.get(refreshKey));
            this.expirationIntervals.delete(refreshKey);
        }
    }

    // Получение времени истечения токена
    getTokenExpiration(username, tokenType) {
        const key = `${username}:${tokenType}`;
        const tokenData = this.storage.get(key);

        if (!tokenData) {
            return null;
        }

        return tokenData.expiresAt;
    }
}

export const tokenStorage = new TokenStorage();