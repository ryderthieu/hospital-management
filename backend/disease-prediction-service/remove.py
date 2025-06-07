import csv

remove_file = "data_info/symptom_remove_list.txt"
input_file = "dataset/data_filtered.csv"
output_file = "dataset/data_symptom_filtered.csv"

# Đọc danh sách triệu chứng cần xóa
with open(remove_file, "r", encoding="utf-8") as f:
    remove_list = set(line.strip() for line in f if line.strip())

with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8", newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    header = next(reader)
    # Xác định các cột cần giữ lại
    keep_indices = [i for i, col in enumerate(header) if col not in remove_list]
    new_header = [header[i] for i in keep_indices]
    writer.writerow(new_header)
    for row in reader:
        new_row = [row[i] for i in keep_indices]
        writer.writerow(new_row)

print(f"Đã lọc xong. File kết quả: {output_file}")