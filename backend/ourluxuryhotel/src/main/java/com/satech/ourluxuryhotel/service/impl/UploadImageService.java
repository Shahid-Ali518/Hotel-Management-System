package com.satech.ourluxuryhotel.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.satech.ourluxuryhotel.service.interfac.IUploadImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class UploadImageService implements IUploadImageService {

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public Map<String, Object> uploadImage(MultipartFile photo, String folderName) throws IOException {

        try{
            Map<String, Object> uploadResult = cloudinary.uploader().upload(photo.getBytes(), ObjectUtils.asMap(
                    "folder", folderName,
                    "folder", folderName,
                    "use_filename", true,
                    "unique_filename", true, // Add this
                    "overwrite", false ));
//            return uploadResult.get("secure_url").toString();
            return uploadResult;
        }
        catch (Exception e){
            System.out.println(e.getMessage());
            log.error("error while uploading image on cloudinary cloud");
            throw e;
        }
    }
}
