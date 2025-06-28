/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function validateprdata(admch)
{           
        if($("#rollno").val()=='')
        {
            alert("Please enter Rollno");
            return false;
        } 
//      var val=$("#declr_flag").val();
//        alert("info ::--"+val);
        
         if($("#declr_flag").val()=='N')
        {
              alert("Please agree with the declaration first then proceed.") ;
              return false;
        } 
        if($("#gender").val()=='')
        {
            alert("Please enter your sex");
            return false;
        }
        if($("#full_name").val()=='')
        {
            alert("Please enter name");
            return false;
        }                
        if($("#email").val()=='')
        {
            alert("Please enter email");
            return false;
        }
        if($("#phone").val()=='')
        {
            alert("Please enter phone/mobile");
            return false;
        }
        if($("#dept_id").val()=='')
        {
            alert("Please enter department");
            return false;
        }
        if($("#profile_id").val()=='')
        {
            alert("Please enter student type");
            return false;
        }
        if($("#category").val()=='')
        {
            alert("Please enter category");
            return false;
        }
        if($("#nationality").val()=='')
        {
            alert("Please enter nationality");
            return false;
        }       
        if($("#standard1").val()=='')
        {
            alert("Please Select Standard for acdemic record no-1");
            return false;
        }
        if($("#standard2").val()=='')
        { 
            alert("Please Select Standard for acdemic record no-2");
            return false;
        }
        if($("#standard6").val()=='')
        { 
            alert("Please enter Standard for acdemic record no-#current");
            return false;
        }
        
        for(var k = 1; k <=6; k++)
        {
            var crpr = k;
            if(k==6)
            {
                crpr= '#current';
            }
            if(!($("#standard"+k).val()=='') && $("#qualification"+k).val()=='')
            {  
                alert("Please Enter Name of degree/exam for acdemic record no-"+crpr);
                return false;
            }
            if(!($("#qualification"+k).val()=='') && $("#standard"+k).val()=='')
            {
                alert("Please Select Standard for acdemic record no-"+crpr);
                return false;
            }
            if(!($("#university"+k).val()=='') && $("#standard"+k).val()=='')
            {     
                alert("Please Select Standard for acdemic record no-"+crpr);
                return false;
            }
            if(!($("#standard"+k).val()=='') && $("#university"+k).val()=='')
            {  
                alert("Please Enter Name of University/Board/Council for acdemic record no-"+crpr);
                return false;
            }
            if(!($("#standard"+k).val()=='') && $("#year"+k).val()=='')
            { 
                alert("Please check year of passing for acdemic record no-"+crpr);
                return false;
                
            }
            if(!($("#standard"+k).val()=='') && ($("#percentage"+k).val()>100))
            { 
                alert("Marks Obtained(%) must be less than 100 for acdemic qualification #"+crpr);
                return false;
            }            
            if((($("#cgpa"+k).val()!='') && ($("#percentage"+k).val()!='')))
            {  
                alert("Please enter either Marks Obtained(%) or CGPA Obtained for acdemic qualification #"+crpr);
                return false;
            }                
            if(!($("#standard"+k).val()=='') && (($("#cgpa"+k).val()=='') && ($("#percentage"+k).val()=='')))
            {   
                alert("Please enter either Marks Obtained(%) or CGPA Obtained for acdemic qualification #"+crpr);
                return false;
            }
            if((($("#cgpa"+k).val()!='') && ($("#outof"+k).val()=='')))
            {   
                alert("Please enter Maximum CGPA field while entering CGPA Obtained for acdemic qualification #"+crpr);
                return false;
            }
            if((($("#percentage"+k).val()!='') && ($("#outof"+k).val()!='')))
            {   
                alert("Please leave Maximum CGPA field blank while entering Marks Obtained(%) for acdemic qualification #"+crpr);
                return false;                
            }
        }
        /////////////////////////////////////////////////////////////////////////
        for(var m = 1; m <= 12; m++)
        {
            for(var n = m+1; n <= 12; n++)
            {
                if($("#cv1_pref"+m).val()!='' && $("#cv1_pref"+n).val()!='' && $("#cv1_pref"+m).val()==$("#cv1_pref"+n).val())
                {
                    alert("Same choice of items can not be given for CV1 ");
                    return false;
                }
                if($("#cv2_pref"+m).val()!='' && $("#cv2_pref"+n).val()!='' && $("#cv2_pref"+m).val()==$("#cv2_pref"+n).val())
                {
                    alert("Same choice of items can not be given for CV2 ");
                    return false;
                }
                if($("#cv3_pref"+m).val()!='' && $("#cv3_pref"+n).val()!='' && $("#cv3_pref"+m).val()==$("#cv3_pref"+n).val())
                {
                    alert("Same choice of items can not be given for CV3 ");
                    return false;
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////

        var answer = confirm ("By clicking 'OK' you will be agreed with the terms & conditions of Career Development Centre for Placement and Internship and registered for the same. ");
            if (answer)
            {
                $('#mode').val('checkdata');
                $('#from2_stu').submit();
            }
//            else
//            {
//                $('#mode').val('cancelenrole');
//                $('#from2_stu').submit();
//            }
}

function DelRow(mode,rollno,table,slno)
{
    var answer = confirm ("Are you sure to delete this row?");
    if (answer)
        window.location="StudentFormAction.jsp?mode="+mode+"&rollno="+rollno+"&table="+table+"&slno="+slno;
}

function hideType()
{
    document.getElementById('examGate').style.display = 'none';
    document.getElementById('examNet').style.display = 'none';
    document.getElementById('examInspire').style.display = 'none';
    document.getElementById('catdtl').style.display = 'none';
    document.getElementById('gmatdtl').style.display = 'none';
    document.getElementById('jeedtl').style.display = 'none';
    document.getElementById('jamdtl').style.display = 'none';
    document.getElementById('prepdtl').style.display = 'none';
    document.getElementById('otherdtl').style.display = 'none';

}
function hideType22(as)
{
    //alert("test type === "+as);
    if(as=="")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="gate")
    {
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examGate').style.display = 'block';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="net")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examNet').style.display = 'block';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="inspire")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'block';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="CAT")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'block';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="GMAT")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'block';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="jee")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'block';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="jam")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'block';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="prep")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'block';
        document.getElementById('otherdtl').style.display = 'none';
    }
    if(as=="other")
    {
        document.getElementById('examGate').style.display = 'none';
        document.getElementById('examNet').style.display = 'none';
        document.getElementById('catdtl').style.display = 'none';
        document.getElementById('gmatdtl').style.display = 'none';
        document.getElementById('examInspire').style.display = 'none';
        document.getElementById('jeedtl').style.display = 'none';
        document.getElementById('jamdtl').style.display = 'none';
        document.getElementById('prepdtl').style.display = 'none';
        document.getElementById('otherdtl').style.display = 'block';
    }
}
function ShowGate()
{
    hideType();
    document.getElementById('examGate').style.display = 'block';
}
function ShowNet()
{
    hideType();
    document.getElementById('examNet').style.display = 'block';
}
function removeDate()
{
    $('.date').each(function(i) { 
        var u = i+1;
        if($("#datepicker"+u).val()!=''){
        document.getElementById('datepicker'+u).value='';
        document.getElementById('exp_span').value='';
        }
    });
}
function resume()
{
    $('#mode').val('freeze');
    $('#from2_stu').submit();
}