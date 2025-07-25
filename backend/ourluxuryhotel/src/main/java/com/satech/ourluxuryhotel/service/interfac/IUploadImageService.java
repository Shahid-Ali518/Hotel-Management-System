package com.satech.ourluxuryhotel.service.interfac;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface IUploadImageService {

    Map<String, Object> uploadImage(MultipartFile photo, String folderName) throws IOException;
}
