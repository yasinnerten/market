package logger

import (
	"time"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.Logger

type Logger struct {
	Logger *zap.SugaredLogger
}

func (l Logger) Printf(format string, v ...interface{}) {
	l.Logger.Infof(format, v...)
}

// Init initializes the logger
func Init() {
	config := zap.NewProductionConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout(time.RFC3339)

	var err error
	log, err = config.Build()
	if err != nil {
		panic(err)
	}
}

// GinLogger returns a gin middleware for logging HTTP requests
func GinLogger() gin.HandlerFunc {
	return gin.Logger()
}

// Info logs an info message
func Info(msg string, fields ...zap.Field) {
	log.Info(msg, fields...)
}

// Error logs an error message
func Error(msg string, fields ...zap.Field) {
	log.Error(msg, fields...)
}

// Debug logs a debug message
func Debug(msg string, fields ...zap.Field) {
	log.Debug(msg, fields...)
}

// Fatal logs a fatal message and exits
func Fatal(msg string, fields ...zap.Field) {
	log.Fatal(msg, fields...)
}

// With adds fields to the logger
func With(fields ...zap.Field) *zap.Logger {
	return log.With(fields...)
}

// Sync flushes any buffered log entries
func Sync() error {
	return log.Sync()
}
