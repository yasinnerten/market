package db

import (
	"errors"

	"gorm.io/gorm"
)

// Create inserts a new record
func Create(value interface{}) error {
	return DB.Create(value).Error
}

// Find retrieves a record by ID
func Find(dest interface{}, id uint) error {
	result := DB.First(dest, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return errors.New("record not found")
		}
		return result.Error
	}
	return nil
}

// Update updates a record
func Update(value interface{}) error {
	return DB.Save(value).Error
}

// Delete deletes a record
func Delete(value interface{}) error {
	return DB.Delete(value).Error
}

// List retrieves records with pagination
func List(dest interface{}, page, pageSize int, conditions ...interface{}) error {
	offset := (page - 1) * pageSize
	query := DB.Offset(offset).Limit(pageSize)

	if len(conditions) > 0 {
		query = query.Where(conditions[0], conditions[1:]...)
	}

	return query.Find(dest).Error
}

// FindBy retrieves a record by a specific condition
func FindBy(dest interface{}, query interface{}, args ...interface{}) error {
	result := DB.Where(query, args...).First(dest)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return errors.New("record not found")
		}
		return result.Error
	}
	return nil
}

// Count returns the total number of records
func Count(model interface{}, conditions ...interface{}) (int64, error) {
	var count int64
	query := DB.Model(model)

	if len(conditions) > 0 {
		query = query.Where(conditions[0], conditions[1:]...)
	}

	err := query.Count(&count).Error
	return count, err
}
