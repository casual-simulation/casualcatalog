const date: DateTime = that?.date ?? DateTime.now();
return date.toUTC().toFormat('yyyyMMdd-HHmmss');