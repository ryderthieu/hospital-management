package org.example.doctorservice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotDto {

  private LocalTime slotStart;
  private LocalTime slotEnd;

}


