import csv

remove_file = "data_info/disease_remove_list.txt"
input_file = "dataset/data.csv"
output_file = "dataset/data_filtered.csv"

# Đọc danh sách bệnh cần loại bỏ
with open(remove_file, "r", encoding="utf-8") as f:
    remove_list = set(line.strip() for line in f if line.strip())

with open(input_file, "r", encoding="utf-8") as infile, open(output_file, "w", encoding="utf-8", newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    header = next(reader)
    writer.writerow(header)
    for row in reader:
        if row and row[0].strip() not in remove_list:
            writer.writerow(row)

print(f"Đã lọc xong. File kết quả: {output_file}") 