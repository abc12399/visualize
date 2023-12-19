import json

def convert_to_json(input_file, output_file):
    # 读取文本文件
    with open(input_file, 'r') as file:
        lines = file.readlines()

    # 处理每一行数据
    data_list = []
    for line in lines:
        parts = line.strip().split(',')
        car_id, time, longitude, latitude = parts

        # 构建字典
        data_dict = {
            'car_id': int(car_id),
            'time': time,
            'latitude': float(latitude),
            'longitude': float(longitude)
        }

        data_list.append(data_dict)

    # 将数据写入 JSON 文件
    with open(output_file, 'w') as json_file:
        json.dump(data_list, json_file, indent=2)

if __name__ == "__main__":
    input_file = "1.txt"
    output_file = "data.json"

    convert_to_json(input_file, output_file)
